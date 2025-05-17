import { Form } from "react-router";
import { type } from "arktype";
import { LoginInputUserDTOSchema } from "@repo/types";
import type { Route } from "./+types/login";

export async function clientAction({ request }: Route.ClientActionArgs) {
  try {
    const formData = await request.formData();
    const loginData = Object.fromEntries(formData);
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error at login: ${error.message}`
        : `unknown error at login`;
    return errorMsg;
  }
}

export default function LoginPage() {
  return (
    <div>
      <Form>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>
        <button type="submit">Log in</button>
      </Form>
    </div>
  );
}
