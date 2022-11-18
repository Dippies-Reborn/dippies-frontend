import { NODE_SEED, TREE_SEED } from "./constants";
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";

import { DipForest } from "./index";
import { PROGRAM_ID as TREEDEA_ID } from "./programId";
import { createNode } from "./instructions";

export class DipTree {
  forest: DipForest;
  treeKey: PublicKey;
  rootNode: PublicKey;
  title: string;

  constructor(forest: DipForest, title: string) {
    this.forest = forest;
    this.treeKey = PublicKey.findProgramAddressSync(
      [
        Buffer.from(TREE_SEED),
        this.forest.forestKey.toBuffer(),
        Buffer.from(title),
      ],
      TREEDEA_ID
    )[0];
    this.rootNode = PublicKey.findProgramAddressSync(
      [
        Buffer.from(NODE_SEED),
        this.treeKey.toBuffer(),
        PublicKey.default.toBuffer(),
        Buffer.from(title),
      ],
      TREEDEA_ID
    )[0];
    this.title = title;
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
          signer: this.forest.signer,
          forest: this.forest.forestKey,
          tree: this.treeKey,
          parentNode: this.rootNode,
          node,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        }
      );
    },
  };
}
