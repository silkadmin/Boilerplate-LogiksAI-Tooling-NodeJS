import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import {
  runTool,
  listAvailableTools,
  listWorkingTools,
  listNotWorkingTools
} from "./run.js";

dotenv.config();

const DATA_DIR = "data";
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

function getCachedResult(refId) {
  const filePath = path.join(DATA_DIR, `${refId}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return null;
}

function processToolBackground(tool, message, params, refId) {
  console.log(`Started background processing for ${refId}...`);
  params.reference_id = refId;
  // You can replace this with actual tool import
  import(`./tools/unstructured_chunks.js`)
    .then(toolModule => toolModule.run(message, params))
    .then(result => {
      fs.writeFileSync(
        path.join(DATA_DIR, `${refId}.json`),
        JSON.stringify(result, null, 2)
      );
      console.log(`Finished background processing for ${refId}`);
    })
    .catch(err => {
      console.error("Background task failed:", err);
    });
}

export async function runRestServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.post("/initiate_run", (req, res) => {
    try {
      const params = req.query;
      const tool = params.tool;
      const message = params.message || "";
      if (!tool) return res.status(400).json({ error: "Tool required" });

      const refId = uuidv4();
      setImmediate(() => processToolBackground(tool, message, params, refId));

      res.json({ status: "processing", reference_id: refId });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });


  app.get("/get_result", (req, res) => {
    const refId = req.query.reference_id;
    const cached = getCachedResult(refId);
    if (cached) {
      res.json({ status: "completed", reference_id: refId, data: cached });
    } else {
      res.json({ status: "processing", reference_id: refId });
    }
  });

  app.post("/run", async (req, res) => {
    try {

     
      
      const { tool, message = "", ...params } = req.query;
      if (!tool) return res.status(400).json({ error: "Tool required" });

      const command = { command: "run", tool, message, params };
      const result = await runTool(command);

      
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  app.get("/list_tools", (_, res) => res.json({ tools: listAvailableTools() }));
  app.get("/list_usefull_tools", (_, res) =>
    res.json({ tools: listWorkingTools() })
  );
  app.get("/unused_list_tools", (_, res) =>
    res.json({ tools: listNotWorkingTools() })
  );

  app.post("/", (_, res) => res.json({ status: "running" }));

  const port = process.env.REST_PORT || 8000;
  app.listen(port, () =>
    console.log(`REST server started on http://0.0.0.0:${port}`)
  );
}
