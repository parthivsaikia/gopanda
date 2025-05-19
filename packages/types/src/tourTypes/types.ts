import { createTourDTOSchema, frontendCreateTourDTOSchema } from "./schema.js";

export type createTourDTO = typeof createTourDTOSchema.infer;
export type frontendCreateTourDTO = typeof frontendCreateTourDTOSchema.infer;
