import {
  MAX_TAG_LENGTH,
  getCreateTreeAccounts,
} from "../../programs/dippiesIndexProtocol";
import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { DIPPIES_FOREST } from "../../utils/ids";
import { FaWindowClose } from "react-icons/fa";
import { TokenInfo } from "../TokenInfo";
import toast from "react-hot-toast";
import useForest from "../../hooks/useForest";

export default () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { program, forest } = useForest();
  const [isOpen, setIsOpen] = useState(false);
  const [tag, setTag] = useState<string>();

  const handleTag: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTag(e.target.value);
  };

  const handleCreate = async () => {
    if (!wallet.publicKey || !tag || !program || !forest) return;

    try {
      await connection.confirmTransaction(
        await program.methods
          .createTree(tag)
          .accounts(
            getCreateTreeAccounts(
              DIPPIES_FOREST,
              forest.admin,
              forest.voteMint,
              tag,
              program.provider.publicKey!
            )!
          )
          .rpc({ skipPreflight: true })
      );
    } catch (e: any) {
      toast.error(e.toString());
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex p-3">
      <div
        className="btn btn-focus btn-large mx-auto"
        onClick={() => setIsOpen(true)}
      >
        Create a new tree
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
              <div className="text-sm text-focus-content">
                The main topic of this tree.
              </div>
              <input
                className="input input-bordered w-full"
                onChange={handleTag}
              />
              <div className="text-end justify-end">
                {tag?.length || 0} / {MAX_TAG_LENGTH}
              </div>
            </div>
            {forest ? (
              <div className="flex flex-row gap-3 text-accent">
                <div>Creating a tree costs</div>
                <TokenInfo
                  mint={forest.voteMint}
                  amount={forest.treeCreationFee}
                />
              </div>
            ) : null}
            <div
              className={`btn ${
                !tag || tag.length > MAX_TAG_LENGTH ? "btn-disabled" : ""
              } w-full`}
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
