import { type } from "arktype";

export const people = type({
  name: "string>0",
  age: "number",
  proofUrl: "string.url",
});

export const bookingFormSchema = type({
  peoples: people.array(),
});
