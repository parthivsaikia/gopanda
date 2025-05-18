import axios from "axios";
import { apiBaseUrl } from "services/config";
import type { Route } from "./+types/agent-dashboard";
import { getProfile } from "services/profile";

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
    </div>
  );
}
