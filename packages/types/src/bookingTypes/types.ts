import { bookingFormSchema } from "./schema.js";

export type BookingFormType = typeof bookingFormSchema.infer;
