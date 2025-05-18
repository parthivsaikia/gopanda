import { redirect } from "react-router";

export function redirectToDashboard(role: string) {
  if (role === "Customer") {
    return redirect("/customer-dashboard");
  } else {
    return redirect("/agent-dashboard");
  }
}
