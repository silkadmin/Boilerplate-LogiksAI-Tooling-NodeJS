// tools/storage_bucket.js

export async function run(message, params) {
  console.log("Storage bucket tool called with:", { message, params });

  if (message === "list_storage_types") {
    return {
      
      storage_types: [
        {
          name: "local",
          description: "Will store files in local file system",
          requiredParams: ["bucket_name"],
        },
      ],
    };
  }

  // default response for unsupported messages
  return {
    status: "error",
    message: `Unknown message '${message}' for storage_bucket tool`,
  };
}
