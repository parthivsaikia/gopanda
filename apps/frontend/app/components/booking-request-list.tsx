import type { BookingStatus } from "@repo/types";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "./ui/accordion";
import UserDataTable from "./user-table";
import { Form, useFetcher } from "react-router";
import { Button } from "./ui/button";

type bookingRequest = {
  _count: {
    persons: number;
  };
  customer: {
    name: string;
  };
  customerId: string;
  id: string;
  paymentId: string;
  persons: {
    name: string;
    age: number;
    verified: true;
    id: "a";
  }[];
  createdAt: string;
  updatedAt: string;
  tour: {
    title: string;
  };
  tourId: string;
  status: BookingStatus;
};

export default function BookingRequests({
  requests,
}: {
  requests: bookingRequest[];
}) {
  const fetcher = useFetcher();

  return (
    <div className="w-[80vw] flex items-center justify-center mx-40">
      <Accordion type="multiple" className="w-full">
        {requests.map((req) => (
          <AccordionItem value={"a"} key={req.id}>
            <AccordionTrigger>
              <span>
                {req.customer.name} wants to book {req.persons.length} tickets
                for the tour {req.tour.title}
                <fetcher.Form>
                  <Button>Accept</Button>
                  <Button>Reject</Button>
                </fetcher.Form>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <span>Customer details</span>
                <UserDataTable data={req.persons} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
