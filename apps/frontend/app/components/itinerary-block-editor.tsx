import React from "react";
import { nanoid } from "nanoid";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import type { TourCreateStepProps } from "@repo/types";
import { Field } from "@tanstack/react-form";
import PlaceSearch from "./placeSearch";

interface ItineraryBlockEditorProps extends TourCreateStepProps {
  dayIndex: number;
  blockIndex: number;
}

export default function ItineraryBlockEditor({
  form,
  dayIndex,
  blockIndex,
}: ItineraryBlockEditorProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-slate-50 p-4">
      <Field
        form={form}
        validators={{
          onChange: ({ value }) => {
            if (!value) {
              return "Field cannot be empty";
            }
          },
        }}
        name={`dayPlan[${dayIndex}].itineraries[${blockIndex}]`}
        children={(blockField) => (
          <>
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Itinerary Block</Label>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() =>
                  form.removeFieldValue(
                    `dayPlan[${dayIndex}].itineraries`,
                    blockIndex,
                  )
                }
              >
                Remove Block
              </Button>
              {!blockField.state.meta.isValid && (
                <em className="text-red-500">
                  {blockField.state.meta.errors.join(", ")}
                </em>
              )}
            </div>

            <Field
              form={form}
              name={`dayPlan[${dayIndex}].itineraries[${blockIndex}].title`}
              // validators={{
              //   onBlur: ({ value }) => {
              //     if (value === "") {
              //       return "Itinerary title cannot be empty";
              //     }
              //   },
              // }}
              children={(titleField) => (
                <div>
                  <Label htmlFor={titleField.name}>Block Title</Label>
                  <Input
                    id={titleField.name}
                    required
                    name={titleField.name}
                    value={titleField.state.value}
                    onChange={(e) => titleField.handleChange(e.target.value)}
                  />
                  {!titleField.state.meta.isValid && (
                    <em className="text-red-500">
                      {titleField.state.meta.errors.join(", ")}
                    </em>
                  )}
                </div>
              )}
            />
            <PlaceSearch
              form={form}
              dayIndex={dayIndex}
              blockIndex={blockIndex}
            />

            <div className="grid grid-cols-2 gap-4">
              <Field
                form={form}
                name={`dayPlan[${dayIndex}].itineraries[${blockIndex}].startTime`}
                validators={{
                  onSubmit: ({ value }) => {
                    if (!value) {
                      return "Start time of itinerary cannot be empty";
                    }
                  },
                }}
                children={(startTimeField) => (
                  <div>
                    <Label htmlFor={startTimeField.name}>Start Time</Label>
                    <Input
                      id={startTimeField.name}
                      name={startTimeField.name}
                      required
                      type="time"
                      value={startTimeField.state.value}
                      onChange={(e) =>
                        startTimeField.handleChange(e.target.value)
                      }
                    />
                  </div>
                )}
              />

              <Field
                form={form}
                name={`dayPlan[${dayIndex}].itineraries[${blockIndex}].endTime`}
                validators={{
                  onSubmit: ({ value }) => {
                    if (!value) {
                      return "End time of itinerary cannot be empty";
                    }
                  },
                  onChangeListenTo: [
                    `dayPlan[${dayIndex}].itineraries[${blockIndex}].startTime`,
                  ],
                  onChange: ({ value, fieldApi }) => {
                    if (
                      value <
                      fieldApi.form.getFieldValue(
                        `dayPlan[${dayIndex}].itineraries[${blockIndex}].startTime`,
                      )
                    ) {
                      return "End time of itinerary must be after start time";
                    }
                  },
                }}
                children={(endTimeField) => (
                  <div>
                    <Label htmlFor={endTimeField.name}>End Time</Label>
                    <Input
                      id={endTimeField.name}
                      required
                      name={endTimeField.name}
                      type="time"
                      value={endTimeField.state.value}
                      onChange={(e) =>
                        endTimeField.handleChange(e.target.value)
                      }
                    />
                  </div>
                )}
              />
            </div>

            <Field
              form={form}
              name={`dayPlan[${dayIndex}].itineraries[${blockIndex}].activities`}
              mode="array"
              validators={{
                onSubmit: ({ value }) => {
                  if (value.length === 0) {
                    return "No activities provided";
                  }
                },
              }}
              children={(activitiesField) => (
                <div>
                  <Label>Activities</Label>
                  <div className="mt-2 space-y-2">
                    {activitiesField.state.value?.map((_, activityIndex) => (
                      <Field
                        key={`activity-${activityIndex}`}
                        form={form}
                        name={`dayPlan[${dayIndex}].itineraries[${blockIndex}].activities[${activityIndex}].title`}
                        children={(activityField) => (
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder={`Activity ${activityIndex + 1}`}
                              name={activitiesField.name}
                              required
                              value={activityField.state.value}
                              autoFocus
                              onChange={(e) =>
                                activityField.handleChange(e.target.value)
                              }
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                activitiesField.removeValue(activityIndex)
                              }
                            >
                              🗑️
                            </Button>
                          </div>
                        )}
                      />
                    )) || []}
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        activitiesField.pushValue({ id: nanoid(), title: "" })
                      }
                    >
                      + Add Activity
                    </Button>
                  </div>
                </div>
              )}
            />
          </>
        )}
      />
    </div>
  );
}
