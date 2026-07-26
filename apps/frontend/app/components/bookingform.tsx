import { Form, useActionData, useFetcher, useSubmit } from "react-router"; // Or from your framework
import { uploadFiles, useUploadThing } from "services/uploadthing";

import { rzpKeyId } from "services/config";
import { useCallback, useEffect, useState } from "react";
import { useRazorpay } from "react-razorpay";
import { Card } from "./ui/card";
import { useForm } from "@tanstack/react-form";
import type { BookingFormType } from "@repo/types";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { verifyPayment } from "services/payment-verification";
import axios from "axios";

export default function BookingForm({
  tourPrice,
  tourId,
  order, // This prop comes from your actionData
}: {
  tourPrice: number;
  tourId: string;
  order: any;
}) {
  const { Razorpay } = useRazorpay();
  const fetcher = useFetcher();
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
  const [paymentResponse, setPaymentResponse] = useState<null | any>(null);
  const handleImageUpload = (url: string, index: number) => {
    form.setFieldValue(`peoples[${index}].proofUrl`, url);
  };
  const { startUpload } = useUploadThing("videoAndImage", {
    onClientUploadComplete: (res) => {
      console.log(res);
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
    onUploadBegin: (file) => {
      console.log("upload has begun for", file);
    },
  });
  const handlePayment = useCallback(
    (orderToPay: any) => {
      const options = {
        key: rzpKeyId,
        amount: orderToPay.amount,
        currency: orderToPay.currency,
        name: "Gopanda",
        description: "Test booking payment",
        order_id: orderToPay.id,
        handler: async (response: any) => {
          console.log("Payment successful!", response);
          const dataForVerification = {
            signature: response.razorpay_signature,
            orderId: orderToPay.id,
            paymentId: response.razorpay_payment_id,
          };
          setPaymentResponse(dataForVerification);
        },
        prefill: {
          name: "Your Customer",
          email: "customer@example.com",
        },
      };
      const rzpay = new Razorpay(options);
      rzpay.open();
    },
    [Razorpay],
  );

  // --- KEY CHANGE 1: This useEffect now triggers the payment ---
  // It runs ONLY when the `order` prop changes.
  useEffect(() => {
    if (order) {
      handlePayment(order);
    }
  }, [order, handlePayment]); // Dependency array ensures it runs when a new order arrives
  useEffect(() => {
    if (paymentResponse) {
      fetcher.submit(paymentResponse, {
        action: "/booking/payment/verify",
        method: "post",
        encType: "application/json",
      });
    }
  }, [paymentResponse]);

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
                  field.pushValue({
                    name: "",
                    age: 0,
                    proofUrl: "",
                    proofFile: null,
                  })
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
                    children={(urlField) => (
                      <>
                        <form.Field
                          name={`peoples[${index}].proofFile`}
                          children={(fileField) => (
                            <>
                              <Label>Upload a government proof</Label>
                              {!urlField.state.value ? (
                                <div>
                                  <Input
                                    type="file"
                                    name={fileField.name}
                                    onChange={(e) => {
                                      const file = e.target.files
                                        ? e.target.files[0]
                                        : null;
                                      fileField.handleChange(file);
                                    }}
                                  />
                                  <Button
                                    onClick={async () => {
                                      const file = fileField.state.value;
                                      if (!file) {
                                        console.log("No files provided");
                                        return;
                                      }
                                      try {
                                        const res = await startUpload([file]);
                                        if (!res) {
                                          return;
                                        }
                                        urlField.setValue(res[0].ufsUrl);
                                      } catch (error) {
                                        const errorMsg =
                                          error instanceof Error
                                            ? `error in uploading file: ${error.message}`
                                            : `unknown error in uploading file`;
                                        throw new Error(errorMsg);
                                      }
                                    }}
                                    type="button"
                                  >
                                    Upload Image
                                  </Button>
                                </div>
                              ) : (
                                <div className="text-green-500">
                                  File uploaded successfully
                                </div>
                              )}
                            </>
                          )}
                        />
                      </>
                    )}
                  />
                </Card>
              ))}
            </>
          )}
        />
        {/* --- KEY CHANGE 2: The button ONLY submits the form --- */}
        {/* Removed the onClick handler. Its only job is to trigger the action. */}
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
