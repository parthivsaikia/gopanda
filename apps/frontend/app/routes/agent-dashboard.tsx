import type { Route } from "./+types/agent-dashboard";
import { getProfile } from "services/profile";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export async function clientLoader() {
  const profileData = await getProfile();
  console.log(profileData);
  return profileData;
}

export default function AgentDashboard({ loaderData }: Route.ComponentProps) {
  const userData = loaderData;
  return (
    <div className="mx-auto flex flex-col gap-4 items-center justify-center my-40">
      <h1 className="text-3xl">
        Welcome <span className="text-secondary">{userData.name}</span>
      </h1>
      <Button asChild variant={"link"}>
        <Link to={`/new-tour`}>Create new Tour</Link>
      </Button>
      <Button asChild variant={"destructive"}>
        <Link to={`/logout`}>Log out</Link>
      </Button>
    </div>
  );
}
