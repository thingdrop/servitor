## Database Entity Achitecture

- Model: Abstract idea of a 3d thing someone can print.
- Part: One or more pieces of a model that can be viewed and downloaded.
- File: A file object of a part. A part only ever has one "current" file to which it points. However, a part can have multiple files that represent previous versions of the part.
- PrintConfig: Specifications on how to print the model. Can this be on the model AND its parts? Allow a user to set a printConfig for entire model OR individually on each part (one part may need different infill?)
- ModelGroup (collection?): A group of models related to each other. This is basically a folder
  - DotA Models: Drow model, jugg model, pudge model.

## Model Processing Workflow

### Model Creation and Upload

1. User creates a model by `createModel` mutation.
   - Response includes accessToken which is needed for further requests.
2. User creates a file associated with the model with `createFile` mutation.
   - Response includes an AWS s3 Post Policy (permission to upload directly to s3).
3. User uploads file to the s3 UPLOAD bucket.

### Upload Event and Processing

1. Uploads to the UPLOAD bucket generate an upload event that is placed onto the REFINERY_EVENT_QUEUE
2. Refinery service polls for upload events and handles them.
   1. Retrieve file from UPLOAD bucket.
   2. Convert the file to GLB format.
   3. Capture screenshot of rendered model and generate image file.
   4. Compress the file (gzip).
   5. Upload the processed GLB to the MODEL bucket.
   6. Upload the screenshot image to the PUBLIC bucket.
   7. Delete the original file (unprocessed) from the UPLOAD bucket.
3. Send a message to the SERVITOR_EVENT_QUEUE containing new file metadata (key, imageUrl, eTag, size, etc))

### Model File Reconciliation

1. Servitor polls for `PROCESSED_EVENT`s from refinery.
2. Get model and file entities from DB.
3. Update file with event's file metadata. Change status to `COMPLETE`.
4. Updat model's fileId to match processed file. Change model status to `COMPLETE`.

## Storage Architecture

### Buckets

- UPLOAD bucket: Temporary storage for user uploaded files. Files uploaded by users might not be in the most performant file format and in nefarious cases might not even be genuine model files (.exe posing as a .stl). This bucket serves as a transient storage before Refinery can process the model. Upon handling the UPLOAD event, Refinery will delete the file whether processing was successful or not.

  - Permissions: private bucket, requiring generate POST policy, but allowed operations include CRUD.

- MODEL bucket:
