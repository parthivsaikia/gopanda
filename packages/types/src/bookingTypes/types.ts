import { bookingFormSchema, people } from "./schema.js";

export type BookingFormType = typeof bookingFormSchema.infer;
export type Persons = typeof people.infer;
