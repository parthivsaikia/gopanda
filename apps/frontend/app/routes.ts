import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/agent-sidebar.tsx", [
    route("/agent/dashboard", "routes/agent-dashboard.tsx"),
    route("/logout", "routes/logout.tsx"),
    route("/agent/tours/new", "routes/create-tour.tsx"),
    route("/agent/tours", "routes/agent-tours.tsx"),
    route("/agent/tour/:id", "routes/agent-tour.tsx"),
    route("/agent/bookings", "routes/agent-bookings.tsx"),
  ]),
  index("routes/home.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/login", "routes/login.tsx"),
  route("/customer/dashboard", "routes/customer-dashboard.tsx"),
  route("/components", "routes/component-testing.tsx"),
  route("/tour-details/:id", "routes/tour-details-route.tsx"),
  route("/booking/:tourId", "routes/booking.tsx"),
  route("/booking/payment/verify", "routes/payment-verify.tsx"),
  route("/api/uploadthing", "routes/apiuploadthings.ts"),
  route("/customer/bookings", "routes/customer-bookings.tsx"),
  route("/customer/bookings/:id", "routes/booking-details.tsx"),
  route("/cancel-booking/:id", "routes/cancel-booking.tsx"),
] satisfies RouteConfig;
