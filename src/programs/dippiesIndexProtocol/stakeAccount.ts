import {
  NOTE_SEED,
  ROOT_AUTHORITY_SEED,
  ROOT_SEED,
  STAKE_SEED,
} from "./constants";
import { Node, Note, Root, Tree } from "./accounts";

import { AnchorProvider } from "@project-serum/anchor";
import { PROGRAM_ID as DIP_PROGRAM_ID } from "./programId";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

export class TreeDeaStakeAccount {
  signer: PublicKey;
  rootId: PublicKey;
  rootKey: PublicKey;
  rootAuthority: PublicKey;
  voteMint: PublicKey;
  voteAccount: PublicKey;
  tree: PublicKey;
  node: PublicKey;
  note: PublicKey;
  stakeAccount: PublicKey;

  constructor(
    signer: PublicKey,
    rootId: PublicKey,
    voteMint: PublicKey,
    tree: PublicKey,
    node: PublicKey,
    note: PublicKey
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
    this.node = node;
    this.note = note;
    this.stakeAccount = PublicKey.findProgramAddressSync(
      [Buffer.from(STAKE_SEED), this.note.toBuffer(), this.signer.toBuffer()],
      DIP_PROGRAM_ID
    )[0];
  }

  static async fromNote(provider: AnchorProvider, note: Note) {
    const node = await Node.fetch(provider.connection, note.parent);
    if (!node) return;

    const tree = await Tree.fetch(provider.connection, node.tree);
    if (!tree) return;

    const root = await Root.fetch(provider.connection, tree.root);
    if (!root) return;

    return new TreeDeaStakeAccount(
      provider.publicKey,
      root.id,
      root.voteMint,
      node.tree,
      note.parent,
      PublicKey.findProgramAddressSync(
        [Buffer.from(NOTE_SEED), node.tree.toBuffer(), note.id.toBuffer()],
        DIP_PROGRAM_ID
      )[0]
    );
  }

  static key(noteKey: PublicKey, signer: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(STAKE_SEED), noteKey.toBuffer(), signer.toBuffer()],
      DIP_PROGRAM_ID
    )[0];
  }
}
