import { createLocalBucket, createGoogleDriveBucket, createS3Bucket, createOneDriveBucket } from '../utils/createBucketUtils.js'

export async function run(message, params) {
  console.log("Storage bucket tool called with:", { message, params });

  switch (message) {
    case "list_storage_types":
      return {
        tool: "storage_bucket",
        storage_types: [
          {
            name: "local",
            description: "Will store files in local file system",
            requiredParams: ["bucket_name", "tool", "storage_type"],
          },
          { name: "s3", description: "AWS S3 storage" },
          { name: "oneDrive", description: "Microsoft OneDrive storage" },
          { name: "google_drive", description: "Google Drive storage" },
        ],
      };

    case "create_bucket":
      {
        const { bucket_name, storage_type } = params;

        if (!bucket_name || !storage_type) {
          return {
            status: "error",
            message: "Missing required parameters: bucket_name or storage_type",
          };
        }

        switch (storage_type) {
          case "local":
            return await createLocalBucket(bucket_name);
          case "s3":
            return await createS3Bucket(bucket_name);
          case "oneDrive":
            return await createOneDriveBucket(bucket_name);
          case "google_drive":
            return await createGoogleDriveBucket(bucket_name);
          default:
            return { status: "error", message: "Unsupported storage type" };
        }

      }

    default:
      return {
        status: "error",
        message: `Unknown message '${message}' for storage_bucket tool`,
      };
  }
}
