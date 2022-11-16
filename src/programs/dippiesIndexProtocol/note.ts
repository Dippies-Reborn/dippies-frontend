import * as anchor from "@project-serum/anchor";

import {
  NODE_SEED,
  NOTE_SEED,
  ROOT_AUTHORITY_SEED,
  ROOT_SEED,
} from "./constants";
import { Node, Root, Tree } from "./accounts";
import { attachNode, attachNote, createNode, createNote } from "./instructions";

import { PROGRAM_ID as DIP_PROGRAM_ID } from "./programId";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

export class TreeDeaNote {
  signer: PublicKey;
  rootId: PublicKey;
  rootKey: PublicKey;
  rootAuthority: PublicKey;
  voteMint: PublicKey;
  voteAccount: PublicKey;
  tree: PublicKey;
  id: PublicKey;
  note: PublicKey;
  node: PublicKey;

  constructor(
    signer: PublicKey,
    rootId: PublicKey,
    voteMint: PublicKey,
    tree: PublicKey,
    noteId: PublicKey,
    node: PublicKey
  ) {
    this.signer = signer;
    this.rootId = rootId;
    this.rootKey = PublicKey.findProgramAddressSync(
      [Buffer.from(ROOT_SEED), rootId.toBuffer()],
      DIP_PROGRAM_ID
    )[0];
    this.rootAuthority = PublicKey.findProgramAddressSync(
      [Buffer.from(ROOT_AUTHORITY_SEED), this.rootKey.toBuffer()],
      DIP_PROGRAM_ID
    )[0];
    this.voteMint = voteMint;
    this.voteAccount = getAssociatedTokenAddressSync(
      voteMint,
      this.rootAuthority,
      true
    );
    this.tree = tree;
    this.id = noteId;
    this.note = PublicKey.findProgramAddressSync(
      [Buffer.from(NOTE_SEED), this.tree.toBuffer(), this.id.toBuffer()],
      DIP_PROGRAM_ID
    )[0];
    this.node = node;
  }

  static async fromNode(provider: anchor.AnchorProvider, node: Node) {
    const tree = await Tree.fetch(provider.connection, node.tree);
    if (!tree) return;

    const root = await Root.fetch(provider.connection, tree.root);
    if (!root) return;
    console.log(tree.root.toString(), root.id.toString());

    const [nodeKey] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(NODE_SEED),
        node.tree.toBuffer(),
        node.parent.toBuffer(),
        Buffer.from(node.tags[node.tags.length - 1]),
      ],
      DIP_PROGRAM_ID
    );

    return new TreeDeaNote(
      provider.publicKey,
      root.id,
      root.voteMint,
      node.tree,
      node.parent,
      nodeKey
    );
  }

  instruction = {
    createNote: (website: string, image: string, description: string) => {
      return createNote(
        { website, image, id: this.id, description },
        {
          signer: this.signer,
          root: this.rootKey,
          tree: this.tree,
          note: this.note,
          node: this.node,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        }
      );
    },
    attachNote: () => {
      return attachNote({
        signer: this.signer,
        root: this.rootKey,
        tree: this.tree,
        note: this.note,
        node: this.node,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      });
    },
  };
}
