// INFO: Place image uploader for tours
// TODO: Move it to tourControllers.ts
import { createRouteHandler, UTApi } from "uploadthing/server";
import type { OurFileRouter } from "../actions/uploadThingActions.js";
import { ourFileRouter } from "../actions/uploadThingActions.js";
import type { Context } from "hono";
import { uploadThingToken } from "../config/config.js";

const uploadThingHandler = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: uploadThingToken,
  },
});

export const imageUpload = async (c: Context) => {
  try {
    const body = await c.req.parseBody({ all: true });
    let photos = body["photos"] as File[];
    if (!Array.isArray(photos)) {
      photos = [photos];
    }
    if (!photos || photos.length === 0) {
      return c.json({ error: "No files provided" }, 400);
    }
    const validFiles = photos.filter((photo) => {
      if (!(photo instanceof File)) return false;
      const isImage = photo.type.startsWith("image/");
      const isValidSize = photo.size <= 16 * 1024 * 1024; // 10MB
      return isImage && isValidSize;
    });
    if (validFiles.length === 0) {
      return c.json(
        { error: "No valid files found. Maximum size allowed 16 MB" },
        400,
      );
    }
    const utpapi = new UTApi({
      token: uploadThingToken,
    });
    const uploadResult = await utpapi.uploadFiles(validFiles);

    const photoUrls: string[] = [];
    const fileDetails: Array<{
      originalName: string;
      uploadedName: string;
      url: string;
      size: number;
    }> = [];

    // UTApi returns an array of results
    uploadResult.forEach((result, index) => {
      if (result.data) {
        const uploadedFile = result.data;
        photoUrls.push(uploadedFile.ufsUrl);
        fileDetails.push({
          originalName: validFiles[index].name,
          uploadedName: uploadedFile.name,
          url: uploadedFile.ufsUrl,
          size: uploadedFile.size,
        });
      } else {
        console.error(
          `Failed to upload file: ${validFiles[index].name}`,
          result.error,
        );
      }
    });

    if (photoUrls.length === 0) {
      return c.json({ error: "Failed to upload any files" }, 500);
    }

    return c.json({
      photoUrls,
      fileDetails,
      message: `Successfully uploaded ${photoUrls.length} out of ${validFiles.length} files`,
    });
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in uploading image: ${error.message}`
        : `unknown error in uploading image`;
    throw new Error(errorMsg);
  }
};
