import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Form } from "react-router";
import { Label } from "@radix-ui/react-label";

export default function TourSearchBar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const minDateString = `${year}-${month}-${day}`;
  return (
    <div>
      <Form method="post" action="/customer-dashboard">
        <Input placeholder={`Search your next destination`} name="place" />
        <div>
          <div>
            <Label>Number of Person</Label>
            <Input type="number" minLength={1} name="persons" id="persons" />
          </div>
          <div>
            <Label>When are you planning to travel</Label>
            <Input type="date" name="date" id="persons" min={minDateString} />
          </div>
        </div>
        <Button type="submit">See Available Tours</Button>
      </Form>
    </div>
  );
}
