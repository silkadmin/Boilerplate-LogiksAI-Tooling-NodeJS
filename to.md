{
  "bucket": {
    "name": "test_bucket7",
    "type": "local",
    "path": "buckets/test_bucket7"
  }
}


switch (type) {
  case "create_bucket":
    const { bucket_name } = params; // ok
    break;
  case "delete_bucket":
    const { bucket_name } = params; //SyntaxError: Identifier already declared
    break;
}


switch (type) {
  case "create_bucket": {
    const { bucket_name } = params; // fine here
    break;
  }
  case "delete_bucket": {
    const { bucket_name } = params; // also fine here
    break;
  }
}

tool:storage_bucket
message:upload_file
bucket:test_bucket8
storage_type:local
path:
filename:test_file9.pdf
mimetype:pdf
mode:attachment/content
exp:3600