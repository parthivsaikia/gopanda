export enum Env {
  DEV = "development",
  PROD = "production",
}

export const env = process.env.NODE_ENV === "production" ? Env.PROD : Env.DEV;
