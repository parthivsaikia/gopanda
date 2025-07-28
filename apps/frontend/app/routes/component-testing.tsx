import { Heart } from "lucide-react";
import TourDetails from "~/components/tourImageGallery";
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
}: {
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

      <Heart
        className="absolute right-2 top-2 fill-accent"
        size={30}
        strokeWidth={1}
      />
    </div>
  );
};

/*export default function TourCard() {
  return (
    <Card className="w-64 h-64 py-4 mx-auto bg-none my-40 flex flex-col  justify-center">
      <CardContent className="relative">
        <ImageHolder src="/hero-image.jpg" placeName="Nagaon" />
      </CardContent>
      <CardHeader className="text-center -my-2 text-sm">
        <CardTitle>Nagaon, Assam, India</CardTitle>
        <CardDescription>13th May - 16th May</CardDescription>
      </CardHeader>
    </Card>
  );
}*/

export default function Testing() {
  return <TourDetails images={["/hero-image.jpg"]} />;
}
