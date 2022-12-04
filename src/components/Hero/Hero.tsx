import { FaDiscord } from "react-icons/fa";
import Link from "next/link";
import React from "react";

interface Props {
  heading: string;
  message: string;
}

const Hero = ({ heading, message }: Props) => {
  return (
    <div className="flex items-center justify-center h-full bg-fixed bg-center bg-cover custom-img">
      <div className="flex flex-col p-5 z-[2] mt-[-5rem] gap-1 bg-base-100 opacity-80 rounded-xl">
        <div className="opacity-100">
          <h2 className="text-5xl font-bold">{heading}</h2>
          <p className="py-2 text-xl">{message}</p>
          <Link href="/collection/dippies">
            <div className="btn btn-lg btn-primary flex flex-row gap-2 w-fit mx-auto text-2xl font-bold text-center p-4">
              Entangle Dippies
            </div>
          </Link>
          <a href="https://discord.gg/TB2jbsuTtm">
            <div className="btn btn-lg btn-ghost flex flex-row gap-2 w-fit mx-auto text-2xl font-bold text-center p-4">
              Go to discord <FaDiscord className="w-8 h-8" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
