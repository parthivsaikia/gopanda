import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { ArrowRightIcon } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="w-4/5 mx-auto">
      <header className="flex justify-between  px-4 py-8">
        <div>
          <p className="text-xl font-bold">Gopanda</p>
        </div>
        <div className="flex gap-4">
          <Button className="w-24">
            <Link to={`/signup`}>Sign up</Link>
          </Button>
          <Button className="w-24 bg-secondary">
            <Link to={`/login`}>Login</Link>
          </Button>
        </div>
      </header>
      <section className="hero-section flex flex-col md:flex-row h-80 p-4 justify-between">
        <div className="text flex flex-col  justify-evenly text-left">
          <h1 className="text-7xl leading-[1.2]">
            Book your tour to the{" "}
            <span className="text-accent italic">heavens</span> on Earth
          </h1>
          <p className="text-lg text-gray-600">
            Explore North East India in the best price
          </p>
          <Button className="w-32 p-4" asChild>
            <Link to={`/signup`}>
              <p>Explore now</p>
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
        <div className="shadow-2xl rounded-4xl">
          <img
            src="/hero-image.jpg"
            alt="dzukou valley"
            className="h-full w-full object-cover rounded-4xl"
          />
        </div>
      </section>
    </div>
  );
}
