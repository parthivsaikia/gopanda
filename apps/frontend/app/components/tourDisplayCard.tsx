import { Heart, Star } from "lucide-react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const ImageHolder = ({
  src,
  placeName,
  show,
}: {
  show: boolean;
  src: string;
  placeName: string;
}) => {
  return (
    <div className="object-cover relative h-44  w-full rounded-2xl flex items-center justify-center ">
      <img
        src={src}
        alt={`An image showing ${placeName}`}
        className="h-full w-full rounded-2xl"
      />

      {show && (
        <Heart
          className="absolute right-2 top-2 fill-accent"
          size={30}
          strokeWidth={1}
        />
      )}
    </div>
  );
};

export default function TourCard({
  id,
  title,
  startDate,
  endDate,
  imageUrl,
  price,
  rating,
  show,
  role,
  spotsLeft,
}: {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  price: number;
  rating: number;
  show: boolean;
  role: string;
  spotsLeft: number;
}) {
  let link = role === "customer" ? `/tour-details/${id}` : `/agent-tour/${id}`;
  return (
    <Link to={link}>
      {" "}
      <Card className="w-64 h-80 py-8 mx-auto bg-transparent shadow-none border-none flex flex-col  justify-center">
        <CardContent className="relative">
          <ImageHolder show={show} src={imageUrl} placeName={title} />
        </CardContent>
        <CardHeader className="text-center -my-2 text-xs flex flex-col items-center justify-center gap-1 ">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="flex flex-col  gap-1 w-full text-xs">
            {startDate} - {endDate}
            <div className="flex items-center justify-center gap-2 text-xs w-full ">
              <p className="font-semibold ">₹ {price} per person`</p>
              <div className="flex items-center justify-center gap-1">
                <Star className="font-semibold" size={10} fill="gold" />
                <p className="font-semibold">4.8</p>
              </div>
              <p>{spotsLeft} spots left</p>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
