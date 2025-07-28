import { Link } from "react-router";
import dayjs from "dayjs";
import { Button } from "./ui/button";
import {
  CardHeader,
  CardTitle,
  Card,
  CardContent,
  CardAction,
} from "./ui/card";

export default function BookNowSection({
  tourName,
  price,
  startDate,
  tourId,
  endDate,
}: {
  tourName: string;
  price: number;
  startDate: string;
  endDate: string;
  tourId: string;
}) {
  let formattedStartDate = dayjs(startDate).format("D MMM YYYY");
  let formattedEndDate = dayjs(endDate).format("D MMM YYYY");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book tour to {tourName} now!!</CardTitle>
        <CardContent>
          <Card>
            <CardHeader>
              <CardTitle>₹ {price}</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p>Start Date : {formattedStartDate}</p>
              </div>
              <div>
                <p>End Date: {formattedEndDate}</p>
              </div>
            </CardContent>
            <CardAction>
              <Button variant={"link"} asChild>
                <Link to={`/booking/${tourId}`}>Book Now</Link>
              </Button>
            </CardAction>
          </Card>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
