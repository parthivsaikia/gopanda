import type { Route } from "./+types/create-tour";
import { type } from "arktype";
import createTour from "services/create-tour";
import { redirect } from "react-router";
import TourCreateForm from "~/components/tour-create-form";
import { frontendCreateTourDTOSchema } from "@repo/types";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const tourData = {
    minimumPeople: Number(formData.get("minimumPeople")),
    price: Number(formData.get("price")),
    startDate: new Date(formData.get("startDate") as string),
    endDate: new Date(formData.get("endDate") as string),
  };
  const validatedData = frontendCreateTourDTOSchema(tourData);
  if (validatedData instanceof type.errors) {
    console.log(validatedData.summary);
    return validatedData.summary;
  } else {
    await createTour(validatedData);
    return redirect("/agent-dashboard");
  }
}

export default function CreateTour({ actionData }: Route.ComponentProps) {
  return (
    <div>
      {actionData && <p>{actionData}</p>}
      <h1>Create new tour</h1>
      <TourCreateForm />
    </div>
  );
}
