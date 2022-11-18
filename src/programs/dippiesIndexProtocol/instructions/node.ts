import { Forest, Node, Tree } from "./accounts";
import {
  Keypair,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
} from "@solana/web3.js";
import { attachNode, createNode } from "./instructions";

import { PROGRAM_ID as DIP_PROGRAM_ID } from "./programId";
import { DipForest } from "./forest";
import { DipNote } from "./note";
import { DipTree } from "./tree";
import { NODE_SEED } from "./constants";
import { Provider } from "@project-serum/anchor";

export class DipNode {
  tree: DipTree;
  parent: PublicKey;
  nodeKey: PublicKey;
  tag: string;

  constructor(tree: DipTree, parent: PublicKey, tag: string) {
    this.tree = tree;
    this.parent = parent;
    this.nodeKey = PublicKey.findProgramAddressSync(
      [
        Buffer.from(NODE_SEED),
        tree.treeKey.toBuffer(),
        parent.toBuffer(),
        Buffer.from(tag),
      ],
      DIP_PROGRAM_ID
    )[0];
    this.tag = tag;
  }

  static async fromNode(provider: Provider, node: Node) {
    const tree = await Tree.fetch(provider.connection, node.tree);
    if (!tree) return;

    const forest = await Forest.fetch(provider.connection, tree.forest);
    if (!forest) return;

    return new DipNode(
      new DipTree(
        new DipForest(
          provider.publicKey!,
          forest.id,
          forest.voteMint,
          forest.admin,
          forest.treeCreationFee
        ),
        tree.title
      ),
      node.parent,
      node.tags[node.tags.length - 1]
    );
  }

  instruction = {
    createChild: (tag: string) => {
      return createNode(
        { tag },
        {
          signer: this.tree.forest.signer,
          forest: this.tree.forest.forestKey,
          tree: this.tree.treeKey,
          parentNode: this.nodeKey,
          node: this.nodeKey,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        }
      );
    },
    attachNode: () => {
      return attachNode({
        signer: this.tree.forest.signer,
        forest: this.tree.forest.forestKey,
        tree: this.tree.treeKey,
        parentNode: this.parent,
        node: this.nodeKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      });
    },
  };

  createNode(tag: string) {
    return {
      ix: this.instruction.createChild(tag),
      child: new DipNode(this.tree, this.nodeKey, tag),
    };
  }
  createNote(website: string, image: string, description: string) {
    const note = new DipNote(this, Keypair.generate().publicKey);
    return {
      ix: note.instruction.createNote(website, image, description),
      note,
    };
  }
}
