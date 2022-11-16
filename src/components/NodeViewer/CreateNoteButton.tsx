import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { AiFillFileAdd } from "react-icons/ai";
import { MAX_CHILD_PER_NODE } from "../../programs/dippiesIndexProtocol";
import { NodeWithKey } from "../../hooks/useTree";
import { Transaction } from "@solana/web3.js";
import { TreeDeaNode } from "../../programs/dippiesIndexProtocol/node";
import { toast } from "react-hot-toast";
import useProvider from "../../hooks/useProvider";

export default ({
  node,
  onCreate,
}: {
  node: NodeWithKey;
  onCreate?: () => void;
}) => {
  const wallet = useWallet();
  const provider = useProvider();
  const { connection } = useConnection();
  const [isOpen, setIsOpen] = useState(false);
  const [website, setWebsite] = useState<string>();
  const [image, setImage] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [isCreating, setIsCreating] = useState(false);

  const handleWebsite: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setWebsite(e.target.value);
  };
  const handleImage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setImage(e.target.value);
  };
  const handleDescription: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setDescription(e.target.value);
  };

  const handleCreateNote = async () => {
    if (!provider || !node || !website || !image || !description) return;
    const treedeaNode = await TreeDeaNode.fromNode(provider, node);

    if (!treedeaNode) return;

    setIsCreating(true);

    const { ix, note } = treedeaNode.createNote(website, image, description);
    const tx = new Transaction().add(ix);

    // Auto attach if parent is empty
    if (node.notes.length < MAX_CHILD_PER_NODE)
      tx.add(note.instruction.attachNote());

    try {
      await connection.confirmTransaction(
        await wallet.sendTransaction(tx, connection, { skipPreflight: true })
      );
      onCreate && onCreate();
    } catch (e: any) {
      toast.error(e.toString());
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div
        className="btn btn-outline max-w-xl mx-auto flex flex-row gap-3"
        onClick={() => setIsOpen(true)}
      >
        <div>Create note</div>
        <AiFillFileAdd className="w-6 h-6" />
      </div>
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="flex flex-col w-lg justify-center p-5">
          <div className="relative flex flex-col gap-2 max-w-3xl bg-base-300 align-center p-3 rounded-xl shadow-xl mx-auto">
            <div
              className="btn btn-sm btn-circle fixed right-2 top-2 absolute"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </div>
            <div className="text-xl font-bold">Create a note</div>
            <div>
              <div className="text-sm">Website the note points to.</div>
            </div>
            <input
              className="input input-bordered w-full"
              placeholder="https://..."
              onChange={handleWebsite}
            />
            <div>
              <div className="text-sm">The cover image of the note.</div>
            </div>
            <input
              className="input input-bordered w-full"
              placeholder="https://..."
              onChange={handleImage}
            />
            <div>
              <div className="text-sm">A short description.</div>
            </div>
            <input
              className="input input-bordered w-full"
              placeholder="https://..."
              onChange={handleDescription}
            />
            <div
              className={`btn btn-primary ${
                website && image && description ? "" : "btn-disabled"
              } ${isCreating ? "btn-disabled loading" : ""}`}
              onClick={handleCreateNote}
            >
              Create a note
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
