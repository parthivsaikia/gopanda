import DayPlanCard from "./day-plan-card";
import DayPlanDialog from "./day-plan-dialog";
import { Field } from "@tanstack/react-form";
import { useState } from "react";
import { Button } from "./ui/button";
import { nanoid } from "nanoid";
import {
  validatedTourPayloadSchema,
  type TourCreateStepProps,
} from "@repo/types";

export default function TourCreateThirdStep({ form }: TourCreateStepProps) {
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Add Day Plans for your tour</h1>
      <Field
        form={form}
        mode="array"
        validators={{
          onSubmit: ({ value }) => {
            if (value.length === 0) {
              return "No day plans provided";
            }
            return undefined;
          },
        }}
        name="dayPlan"
        children={(field) => (
          <div className="space-y-4">
            {field.state.value?.map((dayPlan, index) => (
              <DayPlanCard
                key={dayPlan.id || index}
                dayPlan={dayPlan}
                onRemove={() => field.removeValue(index)}
                onEdit={() => setActiveDayIndex(index)}
              />
            )) || []}
            <Button
              type="button"
              onClick={() => {
                const currentLength = field.state.value?.length || 0;
                field.pushValue({
                  id: nanoid(),
                  day: currentLength + 1,
                  itineraries: [],
                });
                setActiveDayIndex(currentLength);
              }}
            >
              + Add Day Plan
            </Button>
            {activeDayIndex !== null && (
              <DayPlanDialog
                form={form}
                dayIndex={activeDayIndex}
                onClose={() => {
                  if (
                    form.getFieldValue(`dayPlan[${activeDayIndex}].itineraries`)
                      .length === 0
                  ) {
                    field.removeValue(activeDayIndex);
                  }

                  setActiveDayIndex(null);
                }}
              />
            )}
          </div>
        )}
      />
    </div>
  );
}
