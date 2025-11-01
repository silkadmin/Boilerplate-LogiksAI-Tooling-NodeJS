import fs from "fs";
import path from "path";

/**
 * Upload a file to a local bucket folder.
 *
 * @param {string} bucket - Name of the target bucket.
 * @param {string} storage_type - Storage type (should be 'local' for this function).
 * @param {string} uploadPath - Subpath inside the bucket (optional).
 * @param {string} filename - Final filename to store.
 * @param {string} mimetype - MIME type of the file (e.g. 'application/pdf').
 * @param {string} mode - 'attachment' or 'content' mode.
 * @param {number} exp - Expiration time in seconds (optional).
 * @param {object} file - The uploaded file object (from multer/form-data).
 * @param {boolean} overwrite - Whether to overwrite existing file (default false).
 * @returns {Promise<object>} Upload metadata.
 */
export async function uploadLocalBucket(
  bucket,
  storage_type,
  uploadPath,
  filename,
  mimetype,
  mode,
  exp,
  file,
  overwrite = false
) {
  try {
    if (storage_type !== "local") {
      throw new Error(`Unsupported storage type: ${storage_type}`);
    }

    if (!file || !file.path) {
      throw new Error("File not found in request.");
    }

    const baseDir = path.join(process.cwd(), "buckets");
    const bucketDir = path.join(baseDir, bucket);

    //Check if bucket exists
    if (!fs.existsSync(bucketDir)) {
      throw new Error(`Bucket "${bucket}" does not exist.`);
    }

    //Determine final upload directory (including optional subpath)
    const finalDir = uploadPath
      ? path.join(bucketDir, uploadPath)
      : bucketDir;

    //Create subdirectories if needed
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    // ✅ Determine final file path
    const destFilePath = path.join(finalDir, filename);

    //Prevent overwriting unless explicitly allowed
    if (fs.existsSync(destFilePath) && !overwrite) {
      throw new Error(`File "${filename}" already exists in bucket "${bucket}".`);
    }

    //Copy uploaded file to bucket
    await fs.promises.copyFile(file.path, destFilePath);

    //(Optional) remove temp file if multer stored it in /tmp
    if (file.path.includes("/tmp") && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    //Prepare metadata
    const metadata = {
      bucket,
      storage_type,
      filename,
      mimetype,
      mode,
      exp,
      path: destFilePath,
      uploaded_at: new Date().toISOString(),
      url: `/buckets/${bucket}${uploadPath ? `/${uploadPath}` : ""}/${filename}`,
    };

    console.log("File uploaded successfully:", metadata);

    return {
      success: true,
      message: `File "${filename}" uploaded successfully to bucket "${bucket}"`,
      data: metadata,
    };
  } catch (error) {
    console.error("Error uploading file:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}
