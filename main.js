import { runRestServer } from "./api/server.js";
import { startWebSocketServer } from "./api/socket.js";
import { startLaiPluginClient } from "./api/laiplugin.js";

async function main() {
  await Promise.all([
    runRestServer(),
    startWebSocketServer(),
    startLaiPluginClient()
  ]);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});