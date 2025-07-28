import dotenv from "dotenv";
dotenv.config();

export const uploadthingId = process.env.UPLOADTHING_APP_ID!;
export const uploadthingAppId = process.env.UPLOADTHING_APP_ID!;
export const uploadThingToken = process.env.UPLOADTHING_TOKEN;
export const rzpKeyId = process.env.RZP_KEY_ID;
export const rzpKeySecret = process.env.RZP_KEY_SECRET;
