import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import type { BookingStatus } from "@repo/types";
import { Link } from "react-router";

export default function BookingCard({
  imgUrl,
  tourName,
  tourPrice,
  tourStatus,
  startDate,
  endDate,
  url,
}: {
  imgUrl: string;
  tourName: string;
  tourStatus: BookingStatus;
  tourPrice: number;
  startDate: string;
  endDate: string;
  url: string;
}) {
  return (
    <Card>
      <CardContent>
        <div className="object-cover">
          <img src={imgUrl} className="h-full w-full" />
        </div>
        <div>
          <p>{tourName}</p>
          <p
            className={`${tourStatus === "Pending" ? `text-red-500` : `text-green-500`}`}
          >
            {tourStatus}
          </p>
          <p>{tourPrice}</p>
          <p>{startDate}</p>
          <p>{endDate}</p>
          <Button asChild>
            <Link to={`${url}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
