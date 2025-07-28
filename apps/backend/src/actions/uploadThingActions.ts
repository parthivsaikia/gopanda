import { createUploadthing, type FileRouter } from "uploadthing/server";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  photoUploader: f({
    image: {
      maxFileCount: 10,
      maxFileSize: "16MB",
    },
  }).onUploadComplete(async ({ metadata, file }) => {
    (console.log("Upload complete for user"),
      console.log("File Url: ", file.ufsUrl));
    console.log("File name: ", file.name);
    console.log("File size: ", file.size);
    return {
      url: file.ufsUrl,
      name: file.name,
      size: file.size,
    };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
