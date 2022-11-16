import React, { useState } from "react";
import useNote, { NoteWithKey } from "../../hooks/useNote";

import { FaExternalLinkAlt } from "react-icons/fa";
import { GiTwoCoins } from "react-icons/gi";
import Image from "next/image";
import Link from "next/link";
import { formatBn } from "../../utils";
import { useWallet } from "@solana/wallet-adapter-react";

export default ({
  note,
  userStake,
}: {
  note: NoteWithKey;
  userStake: number;
}) => {
  const wallet = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        className="btn w-full justify-around"
        onClick={() => setIsOpen(true)}
      >
        <div>Manage stake</div>
        <GiTwoCoins />
      </div>
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <div
            className="btn btn-sm btn-circle fixed right-2 top-2 absolute"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </div>
          <div className="text-2xl font-bold">Manage stake</div>
        </div>
      </div>
    </>
  );
};
