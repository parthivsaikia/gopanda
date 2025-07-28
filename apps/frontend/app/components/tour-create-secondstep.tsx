import type { TourCreateStepProps } from "@repo/types";
import { Field } from "@tanstack/react-form";

export default function TourCreateSecondStep({ form }: TourCreateStepProps) {
  return (
    <div>
      <label>What facilities do you provide?</label>
      <Field
        form={form}
        name="facilities"
        mode="array"
        validators={{
          onChange: ({ value }) => {
            if (value.length === 0) {
              return "Facilities can't be empty";
            }
          },
        }}
        children={(field) => (
          <>
            {field.state.value.map((facility, index) => (
              <>
                <Field
                  form={form}
                  name={`facilities[${index}]`}
                  key={index}
                  children={(subField) => (
                    <>
                      <input
                        name={subField.name}
                        id={subField.name}
                        value={subField.state.value}
                        onChange={(e) => subField.handleChange(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => field.removeValue(index)}
                      >
                        Remove facility
                      </button>
                    </>
                  )}
                />
              </>
            ))}
            <button type="button" onClick={() => field.pushValue("")}>
              Add Facility
            </button>
          </>
        )}
      />
    </div>
  );
}
