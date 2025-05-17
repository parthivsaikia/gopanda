import { Form } from "react-router";
import { type } from "arktype";
import type { Route } from "./+types/signup";
import { UserInputUserDTOSchema } from "@repo/types";
import { signup } from "services/signup";

export async function clientAction({ request }: Route.ClientActionArgs) {
  try {
    const formData = await request.formData();
    const signupData = Object.fromEntries(formData.entries());
    console.log(signupData);
    const validatedSignupData = UserInputUserDTOSchema(signupData);
    if (validatedSignupData instanceof type.errors) {
      return validatedSignupData.summary;
    } else {
      const user = await signup(validatedSignupData);
    }
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in signup: ${error.message}`
        : `unknown error in signup`;
    return errorMsg;
  }
}

export default function SignupPage() {
  return (
    <div>
      <Form method="post">
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" />
        </div>
        <div>
          <label htmlFor="username">Userame</label>
          <input type="text" name="username" id="username" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>
        <div>
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input type="tel" name="mobileNumber" id="mobileNumber" />
        </div>
        <div>
          <label htmlFor="state">State</label>
          <input type="text" name="state" id="state" />
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input type="text" name="country" id="country" />
        </div>
        <div>
          <label>Role</label>
          <div>
            <input type="radio" name="role" id="customer" value={`Customer`} />
            <label htmlFor="customer">Customer</label>
          </div>
          <div>
            <input
              type="radio"
              name="role"
              id="travelAgent"
              value={`TravelAgent`}
            />
            <label htmlFor="travelAgent">Travel Agent</label>
          </div>
        </div>
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
