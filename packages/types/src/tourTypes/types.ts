import { TourPayloadSchema, dayPlanSchema } from "./schema.js";
import { FormApi } from "@tanstack/react-form";

export type TourFormData = typeof TourPayloadSchema.infer;
export type DayPlan = typeof dayPlanSchema.infer;
type ValidationError = { fields: Record<string, string>; form: string };

export type TourCreateStepProps = {
  form: FormApi<
    TourFormData,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  >;
};
