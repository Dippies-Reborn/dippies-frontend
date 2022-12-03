import { DecimalUtil } from "@orca-so/sdk";
import { FaExternalLinkAlt } from "react-icons/fa";
import ManageStakeButton from "./ManageStakeButton";
import { Note } from "../../programs/dippiesIndexProtocol";
import React from "react";
import { TokenInfo } from "../TokenInfo";
import { formatBn } from "../../utils";
import useForest from "../../hooks/useForest";
import useNote from "../../hooks/useNote";
import useTokenAccount from "../../hooks/useTokenAccount";
import { useWallet } from "@solana/wallet-adapter-react";

export default ({ note }: { note: Note }) => {
  const wallet = useWallet();
  const { forest } = useForest();
  return (
    <div className="w-64 bg-base-200 rounded-xl shadow-xl m-3 flex flex-col gap-2">
      <div>
        <img
          className="w-full rounded-t-xl"
          src={note.image}
          alt={note.description}
        />
      </div>
      <div className="p-3 pt-0">
        <div className="flex flex-col gap-3">
          <div className="divider text-lg font-bold">{note.description}</div>
          <div className="flex flex-row justify-between">
            <div className="font-bold my-auto">Total stake:</div>
            <div className="flex flex- gap-1">
              <div className="my-auto font-bold">
                {forest ? (
                  <TokenInfo mint={forest.voteMint} amount={note.stake} />
                ) : (
                  "??"
                )}
              </div>
            </div>
          </div>
          {wallet.publicKey ? <ManageStakeButton note={note} /> : null}
          <div>
            <div className="font-bold">Tags:</div>
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <div className="badge badge-sm badge-primary">{tag}</div>
              ))}
            </div>
          </div>
          <a href={note.website}>
            <div className="underline font-bold flex justify-center gap-2">
              <div>See this webpage</div>
              <FaExternalLinkAlt className="w-4 h-4 my-auto" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
