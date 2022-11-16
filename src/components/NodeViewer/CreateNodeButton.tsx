import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { BsNodePlusFill } from "react-icons/bs";
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
  const [tag, setTag] = useState<string>();
  const [isCreating, setIsCreating] = useState(false);

  const handleTag: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTag(e.target.value);
  };

  const handleCreateNode = async () => {
    if (!provider || !node || !tag) return;
    const treedeaNode = await TreeDeaNode.fromNode(provider, node);

    if (!treedeaNode) return;

    setIsCreating(true);

    const { ix, child } = treedeaNode.createNode(tag);
    const tx = new Transaction().add(ix);

    // Auto attach if parent is empty
    if (node.children.length < MAX_CHILD_PER_NODE)
      tx.add(child.instruction.attachNode());

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
        className="w-64 bg-base-100 hover:bg-base-200 transition-all border-2 border-base-200 rounded-xl shadow-inner hover:shadow-xl p-6 m-3"
        onClick={() => setIsOpen(true)}
      >
        <BsNodePlusFill className="w-20 h-20 m-auto" />
        <div className="text-2xl text-center">Create node</div>
      </div>
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box flex flex-col gap-2 max-w-3xl bg-base-300 align-center p-3 rounded-xl shadow-xl mx-auto">
          <div
            className="btn btn-sm btn-circle fixed right-2 top-2 absolute"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </div>
          <div className="text-xl font-bold">Tag</div>
          <div>
            <div className="text-sm">The tag of the child node.</div>
            <div className="text-sm">
              A node inherits all his tags from its parent
            </div>
          </div>
          <input
            className="input input-bordered w-full"
            placeholder="Tag..."
            onChange={handleTag}
          />
          <div
            className={`btn btn-primary ${tag ? "" : "btn-disabled"} ${
              isCreating ? "btn-disabled loading" : ""
            }`}
            onClick={handleCreateNode}
          >
            Create a child
          </div>
        </div>
      </div>
    </>
  );
};
