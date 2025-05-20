import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/login", "routes/login.tsx"),
  route("/customer-dashboard", "routes/customer-dashboard.tsx"),
  route("/agent-dashboard", "routes/agent-dashboard.tsx"),
  route("/logout", "routes/logout.tsx"),
  route("/new-tour", "routes/create-tour.tsx"),
] satisfies RouteConfig;
