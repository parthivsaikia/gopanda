import React, { useState } from "react";
import { nanoid } from "nanoid";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import type { TourCreateStepProps } from "@repo/types";
import { Field } from "@tanstack/react-form";
import ItineraryBlockEditor from "./itinerary-block-editor";
import { notify } from "services/notification";

interface DayPlanDialogProps extends TourCreateStepProps {
  dayIndex: number;
  onClose: () => void;
}

export default function DayPlanDialog({
  form,
  dayIndex,
  onClose,
}: DayPlanDialogProps) {
  const [isValidating, setIsValidating] = useState(false);
  const handleDone = async () => {
    setIsValidating(true);
    try {
      // You only need to validate once. `validateAllFields` triggers all rules.
      await form.validateAllFields("submit");

      // It's better to get the errors once and store them in a variable.
      const allErrors = form.getAllErrors();

      // Check if the overall form has any errors. This is the simplest check.
      // Most libraries provide a top-level `errorFields` array in the catch block
      // or a simple way to check validity, but `getAllErrors` also works.

      const formLevelErrors = allErrors.form?.errors?.length ?? 0;
      const dayPlanErrors = allErrors.fields.dayPlan?.errors?.length ?? 0;
      // Note: The field name might just be `dayPlan` if it's an array field.
      // The specific day's error might be nested inside it. Check your library's docs.
      // For now, let's assume your field names are correct.
      const specificDayErrors =
        allErrors.fields[`dayPlan[${dayIndex}].day`]?.errors?.length ?? 0;

      if (
        formLevelErrors === 0 &&
        dayPlanErrors === 0 &&
        specificDayErrors === 0
      ) {
        onClose();
      } else {
        // It's good practice to focus the first invalid field.
        // Most form libraries have a helper for this. e.g., antd's `form.scrollToField(errorFields[0].name)`
        notify("Please fill all the required fields correctly.", "error");
      }
    } catch (errorInfo) {
      // The `validateFields` promise rejects with information about the invalid fields.
      console.log("Validation Failed:", errorInfo);
      notify("Please fill all the required fields correctly.", "error");
    } finally {
      setIsValidating(false);
    }
  };
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <Field
          form={form}
          name={`dayPlan[${dayIndex}].day`}
          children={(dayNumberField) => (
            <DialogHeader>
              <DialogTitle>
                Editing Plan for Day {dayNumberField.state.value}
              </DialogTitle>
            </DialogHeader>
          )}
        />

        <Field
          form={form}
          validators={{
            onSubmit: ({ value }) => {
              if (value.length === 0) {
                return "Itineraries cannot be empty";
              }
              value.forEach((itinerary, index) => {
                if (!itinerary.title?.trim()) {
                  return `Activity not provided for itinerary ${index + 1}`;
                }
                if (!itinerary.startTime) {
                  return `Start time not provided for itinerary ${index + 1}`;
                }
                if (!itinerary.endTime) {
                  return `End time not provided for itinerary ${index + 1}`;
                }
                if (itinerary.activities.length === 0) {
                  return `No activities provided for itinerary ${index + 1}`;
                }
              });
              return undefined;
            },
          }}
          name={`dayPlan[${dayIndex}].itineraries`}
          mode="array"
          children={(blocksField) => (
            <>
              <div className="max-h-[60vh] space-y-4 overflow-y-auto p-4">
                {blocksField.state.meta.errors && (
                  <div className="text-red-600 text-sm mb-2">
                    {blocksField.state.meta.errors[0]}
                  </div>
                )}
                {blocksField.state.value?.map((_, blockIndex) => (
                  <ItineraryBlockEditor
                    key={`block-${blockIndex}`}
                    form={form}
                    dayIndex={dayIndex}
                    blockIndex={blockIndex}
                  />
                )) || []}
              </div>

              <DialogFooter className="flex-col items-start sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    blocksField.pushValue({
                      id: nanoid(),
                      title: "",
                      startTime: "09:00",
                      endTime: "00:00",
                      activities: [],
                    });
                  }}
                >
                  + Add Itinerary Block
                </Button>
                <Button onClick={handleDone} type="button">
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}
