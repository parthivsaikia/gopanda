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
    <div className="border-2 border-red-300 w-2/3">
      <Form method="post" action="/customer-dashboard">
        <div className="flex p-8 flex-col items-center justify-center gap-8">
          <Input
            placeholder={`Search your next destination`}
            name="place"
            className="p-6 w-2/3"
          />
          <div className="flex gap-4 items-center border-2 border-red-500 justify-between w-2/3">
            <div>
              <Label>Number of Person</Label>
              <Input
                type="number"
                className="p-6 w-full"
                minLength={1}
                name="persons"
                id="persons"
              />
            </div>
            <div>
              <Label>When are you planning to travel</Label>
              <Input
                type="date"
                name="date"
                id="persons"
                className="p-6 "
                min={minDateString}
              />
            </div>
          </div>

          <Button type="submit">See Available Tours</Button>
        </div>
      </Form>
    </div>
  );
}
