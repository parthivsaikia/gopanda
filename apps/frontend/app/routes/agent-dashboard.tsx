import type { Route } from "./+types/agent-dashboard";
import { getProfile } from "services/profile";
import { Link } from "react-router";

export async function clientLoader() {
  const profileData = await getProfile();
  console.log(profileData);
  return profileData;
}

export default function AgentDashboard({ loaderData }: Route.ComponentProps) {
  const userData = loaderData;
  return (
    <div>
      <p>{userData.name}</p>
      <p>{userData.username}</p>
      <p>{userData.state}</p>
      <p>{userData.country}</p>
      <p>{userData.role}</p>
      <Link to={`/new-tour`}>Create new Tour</Link>
      <Link to={`/logout`}>Log out</Link>
    </div>
  );
}
