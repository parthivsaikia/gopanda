import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <h1>Welcome to gopanda</h1>
      <Link to={`/signup`}>Sign Up</Link>
      <Link to={`/login`}>Log in</Link>
    </div>
  );
}
