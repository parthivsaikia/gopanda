import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function AgentTourDetails({
  minimumPeople,
  maxPeople,
  price,
  startDate,
  endDate,
}: {
  minimumPeople: string | number;
  maxPeople: string | number;
  price: string | number;
  startDate: string;
  endDate: string;
}) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Tour Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Minimum People : {minimumPeople}</p>
          <p>Maximum People: {maxPeople}</p>
          <p>Price per person : {price}</p>
          <p>Start Date : {startDate}</p>
          <p>End Date : {endDate}</p>
        </CardContent>
      </Card>
    </div>
  );
}
