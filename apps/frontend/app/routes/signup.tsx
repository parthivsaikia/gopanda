import { Form } from "react-router";
import StableFieldError from "~/components/fieldError";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import ErrorComponent from "~/components/errorComponent";
import { Input } from "~/components/ui/input";
import { type } from "arktype";
import type { Route } from "./+types/signup";
import { UserInputUserDTOSchema, Password } from "@repo/types";
import { signup } from "services/signup";
import { useForm } from "@tanstack/react-form";
import userExists from "services/getUser";
import { notify } from "services/notification";
import { redirectToDashboard } from "services/redirect";
import { Card } from "~/components/ui/card";

export async function clientAction({ request }: Route.ClientActionArgs) {
  try {
    let errors = "";
    const formData = await request.formData();
    const signupData = Object.fromEntries(formData.entries());
    const validatedSignupData = UserInputUserDTOSchema(signupData);
    if (validatedSignupData instanceof type.errors) {
      errors = validatedSignupData.summary;
      return { errors: errors };
    } else {
      const user = await signup(validatedSignupData);
      notify("Sign up successful", "success");
      return redirectToDashboard(validatedSignupData.role);
    }
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in signup: ${error.message}`
        : `unknown error in signup`;
    notify("Sign up failed", "error");
    throw new Error(errorMsg);
  }
}

export default function SignupPage({ actionData }: Route.ComponentProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      mobileNumber: "",
      state: "",
      country: "",
      role: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: UserInputUserDTOSchema,
    },
  });

  // Helper function to get input styling based on field state
  const getInputClassName = (field: any) => {
    const hasValue = field.state.value && field.state.value.length > 0;
    const hasError =
      field.state.meta.errors && field.state.meta.errors.length > 0;
    const isValidating = field.state.meta.isValidating;

    if (isValidating) {
      return "border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500";
    }

    if (hasError) {
      return "border-red-300 focus:border-red-500 focus:ring-red-500";
    }

    if (hasValue && !hasError) {
      return "border-green-300 focus:border-green-500 focus:ring-green-500";
    }

    return "";
  };

  return (
    <Card className="w-4/5 p-10 flex flex-col  justify-center mx-auto my-2">
      {actionData?.errors &&
        actionData.errors.split(".").map((e) => <ErrorComponent error={e} />)}

      <Form method="post" className="flex flex-col justify-center gap-6">
        <div className="grid grid-cols-2 justify-center gap-6">
          {" "}
          <div className="flex flex-col gap-2 justify-center">
            <Label htmlFor="name">Name</Label>
            <form.Field
              name="name"
              children={(field) => (
                <>
                  <Input
                    required
                    type="text"
                    name={field.name}
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={getInputClassName(field)}
                  />
                  <StableFieldError field={field} />
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <Label htmlFor="username">Username</Label>
            <form.Field
              name="username"
              validators={{
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: async ({ value }) => {
                  const response = await userExists(value);
                  if (response.exists) {
                    return "Username already exists";
                  } else {
                    return undefined;
                  }
                },
                onChange: ({ value }) => {
                  if (value.length < 6) {
                    return "Username must be greater than 5 characters";
                  }
                  return undefined;
                },
              }}
              children={(field) => (
                <>
                  <Input
                    required
                    type="text"
                    name={field.name}
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={getInputClassName(field)}
                  />
                  <StableFieldError field={field} />
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <Label htmlFor="password">Password</Label>
            <form.Field
              name="password"
              validators={{
                onChange: Password,
              }}
              children={(field) => (
                <>
                  <Input
                    required
                    type="password"
                    minLength={7}
                    name={field.name}
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={getInputClassName(field)}
                  />
                  <StableFieldError field={field} />
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <Label htmlFor="confirmPassword">Confirm your password</Label>
            <form.Field
              name="confirmPassword"
              validators={{
                onChangeListenTo: ["password"],
                onChange: ({ value, fieldApi }) => {
                  if (value !== fieldApi.form.getFieldValue("password")) {
                    return "Passwords do not match";
                  }
                  return undefined;
                },
              }}
              children={(field) => (
                <>
                  <Input
                    required
                    type="password"
                    name={field.name}
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={getInputClassName(field)}
                  />
                  <StableFieldError field={field} />
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <Label htmlFor="email">Email</Label>
            <form.Field
              name="email"
              validators={{
                onChangeAsync: async ({ value }) => {
                  const response = await userExists(
                    undefined,
                    value,
                    undefined,
                  );
                  if (response.exists) {
                    return "User with this email already exists";
                  } else {
                    return undefined;
                  }
                },
              }}
              children={(field) => (
                <>
                  <Input
                    required
                    type="email"
                    name={field.name}
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={getInputClassName(field)}
                  />
                  <StableFieldError field={field} />
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <form.Field
              name="mobileNumber"
              validators={{
                onChangeAsync: async ({ value }) => {
                  const response = await userExists(
                    undefined,
                    undefined,
                    value,
                  );
                  if (response.exists) {
                    return "User with this mobile number already exists";
                  } else {
                    return undefined;
                  }
                },
                onChange: ({ value }) => {
                  if (value.length < 10) {
                    return "Mobile number should contain 10 digits";
                  }
                },
              }}
              children={(field) => (
                <>
                  <Input
                    required
                    type="tel"
                    minLength={10}
                    maxLength={10}
                    name={field.name}
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={getInputClassName(field)}
                  />
                  <StableFieldError field={field} />
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <Label htmlFor="state">State</Label>
            <form.Field
              name="state"
              children={(field) => (
                <>
                  <Input
                    required
                    type="text"
                    name={field.name}
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={getInputClassName(field)}
                  />
                  <StableFieldError field={field} />
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <Label htmlFor="country">Country</Label>
            <form.Field
              name="country"
              children={(field) => (
                <>
                  <Input
                    required
                    type="text"
                    name={field.name}
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={getInputClassName(field)}
                  />
                  <StableFieldError field={field} />
                </>
              )}
            />
          </div>
        </div>
        <div className="flex  items-center p-4 gap-4 justify-center border-2 mx-auto">
          <Label>Role</Label>
          <form.Field
            name="role"
            validators={{
              onSubmit: ({ value }) => {
                if (!value) {
                  return "Please choose an option";
                }
                return undefined;
              },
            }}
            children={(field) => (
              <>
                <RadioGroup className="flex mx-auto" name={field.name}>
                  <div className="flex items-center justify-between gap-2">
                    <RadioGroupItem value="Customer" id="customer" required />
                    <Label htmlFor="customer">Customer</Label>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <RadioGroupItem
                      value="TravelAgent"
                      id="travelagent"
                      required
                    />
                    <Label htmlFor="travelagent">Travel Agent</Label>
                  </div>
                </RadioGroup>
                <StableFieldError field={field} />
              </>
            )}
          />
        </div>{" "}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </Button>
          )}
        />
      </Form>
    </Card>
  );
}
