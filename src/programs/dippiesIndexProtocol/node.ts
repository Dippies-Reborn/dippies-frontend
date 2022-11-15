import * as anchor from "@project-serum/anchor";

import { NODE_SEED, ROOT_AUTHORITY_SEED, ROOT_SEED } from "./constants";
import { Node, Root, Tree } from "./accounts";
import { attachNode, createNode } from "./instructions";

import { PROGRAM_ID as DIP_PROGRAM_ID } from "./programId";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

export class TreeDeaNode {
  signer: PublicKey;
  rootId: PublicKey;
  rootKey: PublicKey;
  rootAuthority: PublicKey;
  voteMint: PublicKey;
  voteAccount: PublicKey;
  tree: PublicKey;
  parent: PublicKey;
  node: PublicKey;
  tag: string;

  constructor(
    signer: PublicKey,
    rootId: PublicKey,
    voteMint: PublicKey,
    tree: PublicKey,
    parent: PublicKey,
    node: PublicKey,
    tag: string
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
    this.parent = parent;
    this.node = node;
    this.tag = tag;
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

    return new TreeDeaNode(
      provider.publicKey,
      root.id,
      root.voteMint,
      node.tree,
      node.parent,
      nodeKey,
      node.tags[node.tags.length - 1]
    );
  }

  instruction = {
    createChild: (tag: string) => {
      const [node] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(NODE_SEED),
          this.tree.toBuffer(),
          this.node.toBuffer(),
          Buffer.from(tag),
        ],
        DIP_PROGRAM_ID
      );
      console.log(this.rootKey.toString(), this.node.toString());
      return createNode(
        { tag },
        {
          signer: this.signer,
          root: this.rootKey,
          tree: this.tree,
          parentNode: this.node,
          node,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        }
      );
    },
    attachNode: () => {
      return attachNode({
        signer: this.signer,
        root: this.rootKey,
        tree: this.tree,
        parentNode: this.parent,
        node: this.node,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      });
    },
  };

  createNode(tag: string) {
    const [node] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(NODE_SEED),
        this.tree.toBuffer(),
        this.node.toBuffer(),
        Buffer.from(tag),
      ],
      DIP_PROGRAM_ID
    );
    return {
      ix: this.instruction.createChild(tag),
      child: new TreeDeaNode(
        this.signer,
        this.rootId,
        this.voteMint,
        this.tree,
        this.node,
        node,
        tag
      ),
    };
  }
}
