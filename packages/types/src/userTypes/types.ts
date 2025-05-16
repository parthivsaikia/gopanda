import { UserInputUserDTOSchema, LoginInputUserDTOSchema } from "./schema.js";
export type UserInputUserDTO = typeof UserInputUserDTOSchema.infer;

export type LoginInputUserDTO = typeof LoginInputUserDTOSchema.infer;
