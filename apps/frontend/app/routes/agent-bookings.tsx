import { getBookingRequests } from "services/booking-request";
import { WebSocketContext } from "~/contexts/WebSocketProvider";
import type { Route } from "./+types/agent-bookings";
import BookingRequests from "~/components/booking-request-list";
import { useContext, useEffect, useState } from "react";

export const clientLoader = async () => {
  try {
    const requests = await getBookingRequests();

    return requests;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in getting booking request action: ${error.message}`
        : `unknown error in getting booking request action`;
    throw new Error(errorMsg);
  }
};

export default function AgentBookings({ loaderData }: Route.ComponentProps) {
  const [requests, setRequests] = useState(loaderData);

  const ws = useContext(WebSocketContext);
  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "new_booking") {
          console.log("message.payload ->", message.payload);
          console.log("Received new booking note", message.payload);
          setRequests((prevRequests) => [message.payload, ...prevRequests]);
        }
      };
    }
  }, [ws]);
  return (
    <div>
      <BookingRequests requests={requests} />
    </div>
  );
}
