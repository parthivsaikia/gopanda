import TourGrid from "~/components/tour-grid";
import { Link } from "react-router";
import type { Route } from "./+types/agent-tours";
import { getToursByAgent } from "services/get-tours";
import { loggedInUser } from "services/loggedInUser";
import { redirect } from "react-router";
import { redirectToDashboard } from "services/redirect";
import { Button } from "~/components/ui/button";

export const clientLoader = async () => {
  try {
    const user = await loggedInUser();
    const role = user.role;
    console.log("role->", role);

    const tours = await getToursByAgent();
    console.log("tours ->", tours);
    console.log(tours.tours[0].bookings.length);
    return tours;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching tours by agent: ${error.message}`
        : `unknown error in fetching tours by agent`;
    throw new Error(errorMsg);
  }
};

export default function ToursByAgent({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <div>
        <Button>
          <Link to={`/agent/tours/new`}>Create new Tour</Link>
        </Button>
      </div>
      <TourGrid role="agent" show={false} tours={loaderData.tours} />
    </div>
  );
}
