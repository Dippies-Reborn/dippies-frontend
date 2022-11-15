import * as anchor from "@project-serum/anchor";

import { NODE_SEED, TREE_SEED } from "./constants";
import { PublicKey, SystemProgram } from "@solana/web3.js";

import { PROGRAM_ID as TREEDEA_ID } from "./programId";
import { TreeDeaRoot } from "./index";
import { createNode } from "./instructions";

export class TreeDeaTree {
  root: TreeDeaRoot;
  treeKey: PublicKey;
  rootNode: PublicKey;

  constructor(
    signer: PublicKey,
    rootId: PublicKey,
    voteMint: PublicKey,
    tag: string
  ) {
    this.root = new TreeDeaRoot(signer, rootId, voteMint);
    this.treeKey = PublicKey.findProgramAddressSync(
      [Buffer.from(TREE_SEED), this.root.rootKey.toBuffer(), Buffer.from(tag)],
      TREEDEA_ID
    )[0];
    this.rootNode = PublicKey.findProgramAddressSync(
      [
        Buffer.from(NODE_SEED),
        this.treeKey.toBuffer(),
        PublicKey.default.toBuffer(),
        Buffer.from(tag),
      ],
      TREEDEA_ID
    )[0];
  }

  instruction = {
    createNode: (tag: string) => {
      const [node] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(NODE_SEED),
          this.treeKey.toBuffer(),
          this.rootNode.toBuffer(),
          Buffer.from(tag),
        ],
        TREEDEA_ID
      );

      return createNode(
        { tag },
        {
          signer: this.root.signer,
          root: this.root.rootKey,
          tree: this.treeKey,
          parentNode: this.rootNode,
          node,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        }
      );
    },
  };
}
