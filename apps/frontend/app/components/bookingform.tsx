import { Form } from "react-router";
import { Card } from "./ui/card";
import { useForm } from "@tanstack/react-form";
import type { BookingFormType } from "@repo/types";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";

export default function BookingForm({
  tourPrice,
  tourId,
}: {
  tourPrice: number;
  tourId: string;
}) {
  const form = useForm<
    BookingFormType,
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
      peoples: [],
    },
  });
  return (
    <section>
      <h2>Who are travelling?</h2>
      <Form method="post" action={`/booking/${tourId}`}>
        <form.Subscribe
          selector={(state) => state.values}
          children={(values) => (
            <input type="hidden" name="data" value={JSON.stringify(values)} />
          )}
        />
        <form.Field
          mode="array"
          name="peoples"
          children={(field) => (
            <>
              <Button
                type="button"
                onClick={() =>
                  field.pushValue({ name: "", age: 0, proofUrl: "" })
                }
              >
                Add People
              </Button>
              {field.state.value.map((_, index) => (
                <Card key={index}>
                  <form.Field
                    name={`peoples[${index}].name`}
                    children={(subField) => (
                      <>
                        <Label>Name</Label>
                        <Input
                          type="text"
                          name={subField.name}
                          value={subField.state.value}
                          onChange={(e) =>
                            subField.handleChange(e.target.value)
                          }
                        />
                      </>
                    )}
                  />
                  <form.Field
                    name={`peoples[${index}].age`}
                    children={(subField) => (
                      <>
                        <Label>Age</Label>
                        <Input
                          type="number"
                          name={subField.name}
                          min={0}
                          value={subField.state.value}
                          onChange={(e) =>
                            subField.handleChange(e.target.valueAsNumber)
                          }
                        />
                      </>
                    )}
                  />
                  <form.Field
                    name={`peoples[${index}].proofUrl`}
                    children={(subField) => (
                      <>
                        <Label>Any government proof</Label>
                        <Input
                          type="text"
                          name={subField.name}
                          value={subField.state.value}
                          onChange={(e) =>
                            subField.handleChange(e.target.value)
                          }
                        />
                      </>
                    )}
                  />
                </Card>
              ))}
            </>
          )}
        />
        <Button type="submit">
          Pay ₹
          <div>
            <form.Subscribe
              selector={(state) => state.values.peoples}
              children={(peoples) => <div>{peoples.length * tourPrice}</div>}
            />
          </div>
        </Button>
      </Form>
    </section>
  );
}
