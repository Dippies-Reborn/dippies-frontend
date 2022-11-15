import { BN, utils } from "@project-serum/anchor";
import { DIPPIES_ROOT, DIPPIES_TOKEN } from "../../utils/ids";
import { EntanglerState, EntanglerWrapper } from "../../programs/entangler";
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { FaWindowClose } from "react-icons/fa";
import { TreeDeaRoot } from "../../programs/dippiesIndexProtocol";
import useRoot from "../../hooks/useRoot";

export default () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { root, fetchTrees } = useRoot();
  const [isOpen, setIsOpen] = useState(false);
  const [tag, setTag] = useState<string>();

  const handleTag: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTag(e.target.value);
  };

  const handleCreate = async () => {
    if (!wallet.publicKey || !tag || !root) return;
    const r = new TreeDeaRoot(wallet.publicKey, root.id, root.voteMint);

    await wallet.sendTransaction(
      new Transaction().add(r.instruction.createTree(tag)),
      connection
    );

    setIsOpen(false);
    fetchTrees();
  };

  return (
    <div className="flex p-3">
      <div
        className="btn btn-primary btn-large mx-auto"
        onClick={() => setIsOpen(true)}
      >
        Create a tree
      </div>
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <div className="flex flex-row justify-between">
            <div className="text-xl font-bold my-auto">Creator</div>
            <div className="btn btn-ghost" onClick={() => setIsOpen(false)}>
              <FaWindowClose className="w-8 h-8" />
            </div>
          </div>
          <div className="form flex flex-col gap-2">
            <div className="">
              <div className="font-bold">Root's title</div>
              <div className="text-sm text-neutral-content">
                The main topic of this tree.
              </div>
              <input
                className="input input-bordered w-full"
                onChange={handleTag}
              />
            </div>
            <div
              className={`btn ${!tag ? "btn-disabled" : ""} w-full`}
              onClick={handleCreate}
            >
              Create a new tree
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
