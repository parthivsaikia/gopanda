import { Form, redirect, useNavigate } from "react-router";
import type { Route } from "./+types/logout";
import axios from "axios";
import { apiBaseUrl } from "services/config";
import { loggedInUser } from "services/loggedInUser";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const csrfToken = (await loggedInUser()).csrfToken;
  await axios.post(`${apiBaseUrl}/auth/logout`, null, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken,
    },
    withCredentials: true,
  });
  return redirect("/");
}

export default function Logout() {
  const navigate = useNavigate();
  return (
    <div>
      <Form method="post">
        <h1>Are you sure you want to log out?</h1>
        <button type="submit">Yes</button>
        <button type="button" onClick={() => navigate(-1)}>
          No
        </button>
      </Form>
    </div>
  );
}
