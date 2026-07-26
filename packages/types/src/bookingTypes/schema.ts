import { type } from "arktype";

export const people = type({
  name: "string>0",
  age: "number",
  proofUrl: "string.url",
  proofFile: "File | null",
});

export const bookingFormSchema = type({
  peoples: people.array(),
});
