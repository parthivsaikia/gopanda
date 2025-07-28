import { Edit } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import type { DayPlan } from "@repo/types";

interface DayPlanCardProps {
  dayPlan: DayPlan;
  onEdit: () => void;
  onRemove: () => void;
}

export default function DayPlanCard({
  dayPlan,
  onEdit,
  onRemove,
}: DayPlanCardProps) {
  const blockCount = dayPlan.itineraries.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Day {dayPlan.day}</CardTitle>
        <CardDescription>
          <span>
            {blockCount} {blockCount === 1 ? `Block` : `Blocks`} |
          </span>
        </CardDescription>
      </CardHeader>
      <CardAction onClick={onRemove}>Remove</CardAction>
      <CardFooter>
        <Button onClick={onEdit} type="button">
          Edit<Edit></Edit>
        </Button>
      </CardFooter>
    </Card>
  );
}
