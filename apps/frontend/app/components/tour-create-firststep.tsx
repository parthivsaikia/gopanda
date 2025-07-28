import type { TourCreateStepProps } from "@repo/types";
import { Input } from "./ui/input";
import { Field } from "@tanstack/react-form";
import { Label } from "./ui/label";
export default function TourCreationFirstStep({ form }: TourCreateStepProps) {
  return (
    <div>
      <div>
        <Label>Minimum People</Label>
        <Field
          form={form}
          name="minimumPeople"
          validators={{
            onChange: ({ value, fieldApi }) => {
              if (value <= 0) {
                return "Minimum number of people must be greater than 0";
              }
            },
          }}
          children={(field) => (
            <>
              <Input
                name="minimumPeople"
                id="minimumPeople"
                type="number"
                value={Number(field.state.value)}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              {!field.state.meta.isValid && (
                <span>{field.state.meta.errors.join(", ")}</span>
              )}
            </>
          )}
        />
      </div>
      <div>
        <Label>Price</Label>
        <Field
          form={form}
          name="price"
          children={(field) => (
            <>
              <Input
                name="price"
                id="price"
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
            </>
          )}
        />
      </div>
      <div>
        {" "}
        <Label>Start Date</Label>
        <Field
          form={form}
          name="startDate"
          children={(field) => (
            <>
              <input
                name={field.name}
                id={field.name}
                value={field.state.value}
                type="date"
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </>
          )}
        />
      </div>
      <div>
        {" "}
        <Label>End Date</Label>
        <Field
          form={form}
          name="endDate"
          validators={{
            onChangeListenTo: ["startDate"],
            onChange: ({ value, fieldApi }) => {
              if (
                new Date(value) <
                new Date(fieldApi.form.getFieldValue("startDate"))
              ) {
                return "End date must be after start date";
              }
            },
          }}
          children={(field) => (
            <>
              <input
                name={field.name}
                id={field.name}
                value={field.state.value}
                type="date"
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </>
          )}
        />
      </div>
    </div>
  );
}
