import { BsArrowLeft, BsBack, BsThreeDots } from "react-icons/bs";
import {
  MAX_CHILD_PER_NODE,
  MAX_NOTES_PER_NODE,
} from "../../programs/dippiesIndexProtocol";

import CreateNodeButton from "./CreateNodeButton";
import CreateNoteButton from "./CreateNoteButton";
import Link from "next/link";
import NodeCard from "./NodeCard";
import NoteCard from "./NoteCard";
import { PublicKey } from "@solana/web3.js";
import React from "react";
import { formatBn } from "../../utils";
import useNode from "../../hooks/useNode";
import useNote from "../../hooks/useNote";

export default ({ nodeKey }: { nodeKey: PublicKey }) => {
  const node = useNode(nodeKey);
  const parent = useNode(node?.parent);
  const children = Array(MAX_CHILD_PER_NODE)
    .fill(0)
    .map((_, i) => useNode(node?.children[i]));
  const notes = Array(MAX_NOTES_PER_NODE)
    .fill(0)
    .map((_, i) => useNote(node?.notes[i]));

  console.log(nodeKey.toString(), node, parent, children, notes);

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
            <div className="flex flex-col gap-3">
              <div className="divider text-lg">Notes</div>
              <div className="flex flex-wrap mx-auto">
                {node.children.length === 0 ? (
                  notes.map((note, i) =>
                    note ? (
                      <NoteCard key={note.tags.join().toString()} note={note} />
                    ) : (
                      <CreateNoteButton key={`create-note-${i}`} node={node} />
                    )
                  )
                ) : (
                  <div className="font-bold">
                    Can't create notes on nodes with children
                  </div>
                )}
              </div>
              <div className="btn btn-ghost w-fit mx-auto">
                <BsThreeDots className="w-12 h-12 m-auto" />
              </div>
            </div>
          ) : null}
          {children ? (
            <div className="flex flex-col gap-3">
              <div className="divider text-lg">Children</div>
              <div className="flex flex-wrap mx-auto">
                {children
                  .sort((a, b) => (a!.stake.gt(b!.stake) ? -1 : 1))
                  .map((child, i) =>
                    child ? (
                      <NodeCard key={child.tags.join()} node={child} />
                    ) : (
                      <CreateNodeButton key={`create-node-${i}`} node={node} />
                    )
                  )}
              </div>
              <div className="btn btn-ghost w-fit mx-auto">
                <BsThreeDots className="w-12 h-12 m-auto" />
              </div>
            </div>
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
