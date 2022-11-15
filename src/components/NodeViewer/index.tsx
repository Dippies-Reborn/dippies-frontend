import { PublicKey, Transaction } from "@solana/web3.js";
import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { FaBackward } from "react-icons/fa";
import Link from "next/link";
import { MAX_CHILD_PER_NODE } from "../../programs/dippiesIndexProtocol";
import NodeCard from "./NodeCard";
import { TreeDeaNode } from "../../programs/dippiesIndexProtocol/node";
import { formatBn } from "../../utils";
import { toast } from "react-hot-toast";
import useNode from "../../hooks/useNode";
import useProvider from "../../hooks/useProvider";

export default ({ node: nodeKey }: { node: PublicKey }) => {
  const wallet = useWallet();
  const provider = useProvider();
  const { connection } = useConnection();
  const { node, children, parent, fetchChildren } = useNode(nodeKey);
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
      fetchChildren();
    } catch (e: any) {
      toast.error(e.toString());
    } finally {
      setIsCreating(false);
    }
  };

  console.log(node, children);

  return (
    <div className="flex flex-col w-lg justify-center p-5">
      <Link
        href={
          node && !node.parent.equals(PublicKey.default)
            ? `/dip/node/${node?.parent}`
            : `/dip/trees`
        }
      >
        <div className="btn">
          <FaBackward className="w-8 h-8" />
        </div>
      </Link>
      {node ? (
        <>
          <div className="divider text-2xl font-bold ">
            {node.tags[node.tags.length - 1]}
          </div>
          <div className="flex flex-wrap mx-auto gap-2">
            <span>Total stake:</span>
            <span>{formatBn(node.stake)}</span>
          </div>
          <div className="flex flex-wrap mx-auto gap-2">
            <div className="text-xl">Tags:</div>
            {node.tags.map((tag) => (
              <div key={tag} className="badge h-full m-1">
                {tag}
              </div>
            ))}
          </div>
          {parent ? (
            <>
              <div className="divider text-lg">Parent</div>
              <div className="btn" onClick={handleCreateNode}>
                Create a child
              </div>
              <div className="flex flex-wrap mx-auto">
                <NodeCard node={parent} />
              </div>
            </>
          ) : null}
          {children ? (
            <>
              <div className="divider text-lg">Children</div>
              {children.length > 0 ? (
                <div className="flex flex-wrap mx-auto">
                  {children.map((child) => (
                    <NodeCard node={child} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-3 text-lg font-bold">
                  This node has no child yet...
                </div>
              )}

              <div className="flex flex-col gap-2 max-w-3xl bg-base-300 align-center p-3 rounded-xl shadow-xl mx-auto">
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
                  className={`btn ${tag ? "" : "btn-disabled"} ${
                    isCreating ? "btn-disabled loading" : ""
                  }`}
                  onClick={handleCreateNode}
                >
                  Create a child
                </div>
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
};
