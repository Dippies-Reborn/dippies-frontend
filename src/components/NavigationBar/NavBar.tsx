import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { SelectAndConnectWalletButton } from "../SelectAndConnectWalletButton";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/collections" },
  { name: "DIP", href: "/dip" },
];

const NavBar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div className="left-0 top-0 w-full z-10 ease-in duration-300">
      <div className="max-w-[1240px] m-auto flex justify-between items-center p-4 bg-base-200 shadow-lg rounded-b-xl">
        <Link href="/">
          <h1 className="font-bold text-4xl">Dippies Club</h1>
        </Link>
        <ul className="hidden sm:flex">
          {navItems.map((e) => (
            <li key={e.href} className="p-4">
              <Link href={e.href}>{e.name}</Link>
            </li>
          ))}
          <li>
            <SelectAndConnectWalletButton />
          </li>
        </ul>

        {/* Mobile Button */}
        <div onClick={handleNav} className="block sm:hidden z-10">
          {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </div>
        {/* Mobile Menu */}
        <div
          className={
            nav
              ? "sm:hidden absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center w-full h-screen bg-black text-center ease-in duration-300"
              : "sm:hidden absolute top-0 left-[-100%] right-0 bottom-0 flex justify-center items-center w-full h-screen bg-black text-center ease-in duration-300"
          }
        >
          <ul>
            {navItems.map((e) => (
              <li
                key={e.href}
                onClick={handleNav}
                className="p-4 text-4xl hover:text-gray-500"
              >
                <Link href={e.href}>{e.name}</Link>
              </li>
            ))}
            <li>
              <SelectAndConnectWalletButton />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
