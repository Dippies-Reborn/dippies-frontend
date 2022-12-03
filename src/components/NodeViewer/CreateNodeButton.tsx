import {
  MAX_CHILD_PER_NODE,
  Node,
  getAttachNodeAccounts,
  getCreateNodeAccounts,
  getNodeAddress,
} from "../../programs/dippiesIndexProtocol";
import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { BsNodePlusFill } from "react-icons/bs";
import { DIPPIES_FOREST } from "../../utils/ids";
import { Transaction } from "@solana/web3.js";
import { toast } from "react-hot-toast";
import useForest from "../../hooks/useForest";
import useProvider from "../../hooks/useProvider";

export default ({ node, onCreate }: { node: Node; onCreate?: () => void }) => {
  const wallet = useWallet();
  const provider = useProvider();
  const { connection } = useConnection();
  const { program, forest } = useForest();
  const [isOpen, setIsOpen] = useState(false);
  const [tag, setTag] = useState<string>();
  const [isCreating, setIsCreating] = useState(false);

  const handleTag: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTag(e.target.value);
  };

  const handleCreateNode = async () => {
    if (!provider || !program || !forest || !node || !tag) return;

    setIsCreating(true);

    const nodeKey = getNodeAddress(
      node.tree,
      node.parent,
      node.tags[node.tags.length - 1]
    );
    const tx = new Transaction();

    tx.add(
      await program.methods
        .createNode(tag)
        .accounts(
          getCreateNodeAccounts(
            DIPPIES_FOREST,
            node.tree,
            nodeKey,
            tag,
            program.provider.publicKey!
          )!
        )
        .instruction()
    );

    // Auto attach if parent is empty
    if (node.children.length < MAX_CHILD_PER_NODE) {
      tx.add(
        await program.methods
          .attachNode()
          .accounts(
            getAttachNodeAccounts(
              DIPPIES_FOREST,
              node.tree,
              nodeKey,
              getNodeAddress(node.tree, nodeKey, tag),
              program.provider.publicKey!
            )!
          )
          .instruction()
      );
    }

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
        className="w-64 bg-base-100 hover:bg-base-200 transition-all border-2 border-base-200 rounded-xl shadow-inner hover:shadow-xl p-6 m-3 flex flex-col"
        onClick={() => setIsOpen(true)}
      >
        <div className="m-auto">
          <BsNodePlusFill className="w-20 h-20 m-auto" />
          <div className="text-2xl text-center">Create node</div>
        </div>
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
