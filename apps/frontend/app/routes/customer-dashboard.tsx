import type { Route } from "./+types/customer-dashboard";
import { getProfile } from "services/profile";
import { Link } from "react-router";
import TourGrid from "~/components/tour-grid";
import { getAllTours, getToursByParams } from "services/get-tours";
import TourSearchBar from "~/components/tourSearchBar";

export async function clientAction({ request }: Route.ClientActionArgs) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const response = await getToursByParams(data);
    return response.tours;
    // if (Array.isArray(tours)) {
    //   return tours;
    // } else {
    //   return [tours];
    // }
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in clientAction to get tours by place, date and persons: ${error.message}`
        : `unknown error in clientAction to get tours by place, date and persons`;
    throw new Error(errorMsg);
  }
}

export async function clientLoader() {
  const profileData = await getProfile();
  const tours = await getAllTours();
  return { profileData, tours };
}

export default function CustomerDashboard({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const userData = loaderData.profileData;
  const tours = actionData || loaderData.tours;
  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <p>{userData.name}</p>
        <p>{userData.role}</p>
        <Link to={`/logout`}>Log out</Link>
      </div>
      <TourSearchBar />
      <TourGrid tours={tours} />
    </div>
  );
}
