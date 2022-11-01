import { FaDiscord } from "react-icons/fa";
import React from "react";

const contact = () => {
  return (
    <div id="contact" className="max-w-[1240px] m-auto p-4 h-screen">
      <a href="https://discord.gg/TB2jbsuTtm">
        <div className="btn btn-lg flex flex-row gap-2 w-fit mx-auto text-2xl font-bold text-center p-4">
          Go to discord <FaDiscord className="w-8 h-8" />
        </div>
      </a>
    </div>
  );
};

export default contact;
