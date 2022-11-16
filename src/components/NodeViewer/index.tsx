import { BsArrowLeft, BsBack, BsThreeDots } from "react-icons/bs";
import {
  MAX_CHILD_PER_NODE,
  MAX_NOTES_PER_NODE,
} from "../../programs/dippiesIndexProtocol";
import { PublicKey, Transaction } from "@solana/web3.js";
import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import CreateNodeButton from "./CreateNodeButton";
import CreateNoteButton from "./CreateNoteButton";
import Link from "next/link";
import NodeCard from "./NodeCard";
import NoteCard from "./NoteCard";
import { TreeDeaNode } from "../../programs/dippiesIndexProtocol/node";
import { formatBn } from "../../utils";
import { toast } from "react-hot-toast";
import useNode from "../../hooks/useNode";
import useProvider from "../../hooks/useProvider";

export default ({ node: nodeKey }: { node: PublicKey }) => {
  const wallet = useWallet();
  const provider = useProvider();
  const { connection } = useConnection();
  const { node, children, parent, notes, fetchChildren } = useNode(nodeKey);
  const [tag, setTag] = useState<string>();
  const [website, setWebsite] = useState<string>();
  const [image, setImage] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [isCreating, setIsCreating] = useState(false);

  const handleTag: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTag(e.target.value);
  };
  const handleWebsite: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setWebsite(e.target.value);
  };
  const handleImage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setImage(e.target.value);
  };
  const handleDescription: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setDescription(e.target.value);
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
      fetchChildren();
    } catch (e: any) {
      toast.error(e.toString());
    } finally {
      setIsCreating(false);
    }
  };

  console.log(node, children, notes, nodeKey.toString());

  return (
    <div className="flex flex-col w-lg justify-center p-5">
      <Link
        href={
          node && !node.parent.equals(PublicKey.default)
            ? `/dip/node/${node?.parent}`
            : `/dip/trees`
        }
      >
        <div className="btn btn-ghost">
          <BsArrowLeft className="w-8 h-8" />
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
              <div key={tag} className="badge badge-primary h-full m-1">
                {tag}
              </div>
            ))}
          </div>
          {notes ? (
            <>
              <div className="divider text-lg">Notes</div>
              <div className="flex flex-wrap mx-auto">
                {notes.map((note) => (
                  <NoteCard key={note.key.toString()} note={note} />
                ))}
                {Array(MAX_NOTES_PER_NODE - notes.length)
                  .fill(0)
                  .map((_, i) => (
                    <CreateNoteButton key={`create-note-${i}`} node={node} />
                  ))}
              </div>
              <div className="btn btn-ghost w-fit mx-auto">
                <BsThreeDots className="w-12 h-12 m-auto" />
              </div>
            </>
          ) : null}
          {children ? (
            <>
              <div className="divider text-lg">Children</div>
              <div className="flex flex-wrap mx-auto">
                {children
                  .sort((a, b) => (a.stake.gt(b.stake) ? -1 : 1))
                  .map((child) => (
                    <NodeCard key={child.key.toString()} node={child} />
                  ))}
                {Array(MAX_CHILD_PER_NODE - children.length)
                  .fill(0)
                  .map((_, i) => (
                    <CreateNodeButton
                      key={`create-node-${i}`}
                      node={node}
                      onCreate={fetchChildren}
                    />
                  ))}
              </div>
              <div className="btn btn-ghost w-fit mx-auto">
                <BsThreeDots className="w-12 h-12 m-auto" />
              </div>
            </>
          ) : null}
          {parent ? (
            <>
              <div className="divider text-lg">Parent</div>
              <div className="flex flex-wrap mx-auto">
                <NodeCard node={parent} />
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
};
