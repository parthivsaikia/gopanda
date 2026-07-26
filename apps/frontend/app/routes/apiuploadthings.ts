import { createRouteHandler, createUploadthing } from "uploadthing/remix";
import { UploadThingError } from "uploadthing/server";
import type { FileRouter } from "uploadthing/types";

const f = createUploadthing();

export const uploadRouter = {
  videoAndImage: f({
    image: { maxFileSize: "4MB" },
    video: { maxFileSize: "16MB" },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload complete for userId:", metadata.userId);
    console.log("file url", file.ufsUrl);
  }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

const uploadthing = createRouteHandler({ router: uploadRouter });

export const loader = uploadthing.loader;
export const action = uploadthing.action;
