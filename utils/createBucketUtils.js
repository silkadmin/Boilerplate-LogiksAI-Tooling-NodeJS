import fs from 'fs';
import path from 'path';

export async function createLocalBucket(bucket_name) {

  try {
    const parentdir = path.resolve(process.cwd(), '');
    const basedir = path.join(parentdir, "buckets");

    if (!fs.existsSync(basedir)) {
      fs.mkdirSync(basedir);
      console.log('created base bucket folder', basedir);
    }

    const bucketDir = path.join(basedir, bucket_name)
    if (fs.existsSync(bucketDir)) {
      return {
        status: "exists",
        message: `Bucket '${bucket_name}' already exists.`,
        path: bucketDir,
      };
    }

    fs.mkdirSync(bucketDir);
    console.log("created bucket", bucketDir);

    return {
      status: "success",
      message: `local bucket ${bucket_name} created successfully`,
      path: bucketDir,
    }
  } catch (error) {

    console.error("Error creating local bucket:", error);
    return { status: "error", message: error.message };

  }
}

export async function createS3Bucket(bucket_name) {
  return { status: "todo", message: `S3 bucket '${bucket_name}' creation pending implementation.` };
}

export async function createOneDriveBucket(bucket_name) {
  return { status: "todo", message: `OneDrive bucket '${bucket_name}' creation pending implementation.` };
}

export async function createGoogleDriveBucket(bucket_name) {
  return { status: "todo", message: `Google Drive bucket '${bucket_name}' creation pending implementation.` };
}


