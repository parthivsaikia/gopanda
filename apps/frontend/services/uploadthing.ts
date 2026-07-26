import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import { type UploadRouter } from "../app/routes/apiuploadthings";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<UploadRouter>();
export const UploadButton = generateUploadButton<UploadRouter>();
export const UploadDropZone = generateUploadDropzone<UploadRouter>();
