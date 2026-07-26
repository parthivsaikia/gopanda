import { Form, useFetcher, useSubmit } from "react-router";
import FieldError from "./fieldError";
import { Button } from "./ui/button";
import { useForm, useStore, type ValidationError } from "@tanstack/react-form";
import { type TourFormData } from "@repo/types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { PlusCircleIcon } from "lucide-react";
import TourCreateThirdStep from "./tour-create-thirdstep";

export default function TourCreateForm() {
  const fetcher = useFetcher();

  const form = useForm<
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
  >({
    defaultValues: {
      maximumPeople: 10,
      minimumPeople: 5,
      price: 1000,
      startDate: "",
      endDate: "",
      facilities: [],
      dayPlan: [],
    },
    onSubmit: async ({ value }) => {
      fetcher.submit(value, {
        method: "post",
        action: "/agent/tours/new",
        encType: "application/json",
      });
    },
  });

  const errors = useStore(form.store, (state) => state.errorMap);

  return (
    <div className="w-4/5 mx-auto ">
      <form
        className="flex flex-col gap-16"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className="first part grid-cols-2 grid gap-10 ">
          <div className="flex flex-col  justify-center gap-2">
            <Label>Minimum People </Label>
            <form.Field
              name="minimumPeople"
              validators={{
                onSubmit: ({ value }) => {
                  if (!value) {
                    return "Minimum People cannot be empty.";
                  }
                },
              }}
              children={(field) => (
                <div className="flex flex-col items-center justify-center relative">
                  <Input
                    type="number"
                    min={1}
                    className={`${!field.state.meta.isValid ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-green-500 focus:border-green-500 focus:ring-green-500"}`}
                    max={300}
                    placeholder="Minimum People"
                    required
                    autoFocus
                    id="minimumPeople"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  />
                  {<FieldError field={field} />}
                </div>
              )}
            />
          </div>
          <div className="flex flex-col  justify-center gap-2">
            <Label>Maximum People </Label>
            <form.Field
              name="maximumPeople"
              validators={{
                onSubmit: ({ value }) => {
                  if (!value) {
                    return "Minimum People cannot be empty.";
                  }
                },
              }}
              children={(field) => (
                <div className="flex flex-col items-center justify-center relative">
                  <Input
                    type="number"
                    min={1}
                    className={`${!field.state.meta.isValid ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-green-500 focus:border-green-500 focus:ring-green-500"}`}
                    max={300}
                    placeholder="Minimum People"
                    required
                    autoFocus
                    id="minimumPeople"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  />
                  {<FieldError field={field} />}
                </div>
              )}
            />
          </div>

          <div className="flex flex-col  justify-center gap-2">
            <Label>Price per person</Label>
            <form.Field
              name="price"
              validators={{
                onSubmit: ({ value }) => {
                  if (!value) {
                    return "Price cannot be empty";
                  }
                },
              }}
              children={(field) => (
                <>
                  <Input
                    type="number"
                    min={0}
                    required
                    placeholder="Price per person"
                    id="price"
                    className={`${!field.state.meta.isValid ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-green-500 focus:border-green-500 focus:ring-green-500"}`}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  />
                  {<FieldError field={field} />}
                </>
              )}
            />
          </div>
          <div className="flex flex-col  justify-center gap-2">
            <Label>Start date of tour</Label>
            <form.Field
              name="startDate"
              validators={{
                onSubmit: ({ value }) => {
                  if (!value) {
                    return "start date cannot be empty";
                  }
                  return undefined;
                },
                onChange: ({ value }) => {
                  if (new Date(value) < new Date()) {
                    return "Start date must be after today";
                  }
                  return undefined;
                },
              }}
              children={(field) => (
                <>
                  <Input
                    type="date"
                    placeholder="Start date of tour"
                    id="startDate"
                    required
                    name={field.name}
                    value={field.state.value}
                    className={`${!field.state.meta.isValid ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-green-500 focus:border-green-500 focus:ring-green-500"}`}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {<FieldError field={field} />}
                </>
              )}
            />
          </div>
          <div className="flex flex-col  justify-center gap-2">
            <Label>End date of the tour</Label>
            <form.Field
              name="endDate"
              validators={{
                onSubmit: ({ value }) => {
                  if (!value) {
                    return "End date cannot be empty";
                  }
                },
                onChangeListenTo: ["startDate"],
                onChange: ({ value, fieldApi }) => {
                  if (value < fieldApi.form.getFieldValue("startDate")) {
                    return "End date must be after start date.";
                  }
                },
              }}
              children={(field) => (
                <div className="flex flex-col items-center justify-center relative">
                  <Input
                    type="date"
                    placeholder="End date of the tour"
                    id="endDate"
                    name={field.name}
                    className={`${!field.state.meta.isValid ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-green-500 focus:border-green-500 focus:ring-green-500"}`}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {<FieldError field={field} />}
                </div>
              )}
            />
          </div>
        </div>
        <div className="second part">
          <h1>Add the facilities you provide</h1>
          <form.Field
            name="facilities"
            mode="array"
            validators={{
              onSubmit: ({ value }) => {
                if (value.length === 0) {
                  return "No facility provided";
                }
              },
            }}
            children={(field) => (
              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  onClick={() => field.pushValue("")}
                  className="w-96 cursor-pointer"
                >
                  Add facility
                  <PlusCircleIcon />
                </Button>
                {field.state.value.map((facility, index) => (
                  <div
                    key={`facilities-${index}`}
                    className="flex flex-col gap-4"
                  >
                    <form.Field
                      name={`facilities[${index}]`}
                      validators={{
                        onSubmit: ({ value }) => {
                          if (!value) {
                            return "Cannot be empty";
                          }
                        },
                      }}
                      children={(subField) => (
                        <div className="flex w-96 gap-4">
                          <Input
                            name={subField.name}
                            autoFocus
                            value={subField.state.value}
                            onChange={(e) =>
                              subField.handleChange(e.target.value)
                            }
                            className={`${!field.state.meta.isValid ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-green-500 focus:border-green-500 focus:ring-green-500"}`}
                          />
                          <Button
                            type="button"
                            variant={"ghost"}
                            onClick={() => field.removeValue(index)}
                          >
                            X
                          </Button>
                          {!subField.state.meta.isValid && (
                            <FieldError field={subField} />
                          )}
                        </div>
                      )}
                    />
                  </div>
                ))}
                {<FieldError field={field} />}
              </div>
            )}
          />
        </div>
        <div className="third part">
          <TourCreateThirdStep form={form} />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Create "}
            </Button>
          )}
        />{" "}
        <form.Subscribe
          selector={(state) => state.errors}
          children={(errorMap) => (
            <div>
              onChange{errors.onChange}onBlur{errors.onBlur}onSubmit
              {errors.onSubmit}
            </div>
          )}
        />
      </form>
    </div>
  );
}
