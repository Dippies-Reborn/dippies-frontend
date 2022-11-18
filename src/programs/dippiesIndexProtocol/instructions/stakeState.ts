import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { AnchorProvider, BN } from "@project-serum/anchor";
import { Node, Note } from "./accounts";
import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
} from "@solana/web3.js";
import { closeStake, createStake, updateStake } from "./instructions";

import { PROGRAM_ID as DIP_PROGRAM_ID } from "./programId";
import { DipNode } from "./node";
import { DipNote } from "./note";
import { STAKE_SEED } from "./constants";

export class DipStakeState {
  note: DipNote;
  stakeKey: PublicKey;

  constructor(note: DipNote, signer?: PublicKey) {
    this.note = note;
    if (signer) this.note.node.tree.forest.signer = signer;
    this.stakeKey = PublicKey.findProgramAddressSync(
      [
        Buffer.from(STAKE_SEED),
        this.note.noteKey.toBuffer(),
        this.note.node.tree.forest.signer.toBuffer(),
      ],
      DIP_PROGRAM_ID
    )[0];
  }

  static async fromNote(provider: AnchorProvider, note: Note) {
    const node = await Node.fetch(provider.connection, note.parent);
    if (!node) return;

    return new DipStakeState(
      new DipNote((await DipNode.fromNode(provider, node))!, note.id)
    );
  }

  static key(noteKey: PublicKey, signer: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(STAKE_SEED), noteKey.toBuffer(), signer.toBuffer()],
      DIP_PROGRAM_ID
    )[0];
  }

  instruction = {
    createStake: () => {
      return createStake({
        signer: this.note.node.tree.forest.signer,
        forestAuthority: this.note.node.tree.forest.forestAuthority,
        forest: this.note.node.tree.forest.forestKey,
        voteMint: this.note.node.tree.forest.voteMint,
        tree: this.note.node.tree.treeKey,
        node: this.note.node.nodeKey,
        note: this.note.noteKey,
        stakeState: this.stakeKey,
        stakerAccount: getAssociatedTokenAddressSync(
          this.note.node.tree.forest.voteMint,
          this.note.node.tree.forest.signer,
          true
        ),
        voteAccount: getAssociatedTokenAddressSync(
          this.note.node.tree.forest.voteMint,
          this.note.node.tree.forest.forestAuthority,
          true
        ),
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      });
    },
    updateStake: (stake: BN) => {
      return updateStake(
        { stake },
        {
          signer: this.note.node.tree.forest.signer,
          forestAuthority: this.note.node.tree.forest.forestAuthority,
          forest: this.note.node.tree.forest.forestKey,
          voteMint: this.note.node.tree.forest.voteMint,
          tree: this.note.node.tree.treeKey,
          node: this.note.node.nodeKey,
          note: this.note.noteKey,
          stakeState: this.stakeKey,
          stakerAccount: getAssociatedTokenAddressSync(
            this.note.node.tree.forest.voteMint,
            this.note.node.tree.forest.signer
          ),
          voteAccount: getAssociatedTokenAddressSync(
            this.note.node.tree.forest.voteMint,
            this.note.node.tree.forest.forestAuthority,
            true
          ),
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          clock: SYSVAR_CLOCK_PUBKEY,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        }
      );
    },
    closeStake: () => {
      return closeStake({
        signer: this.note.node.tree.forest.signer,
        forest: this.note.node.tree.forest.forestKey,
        tree: this.note.node.tree.treeKey,
        note: this.note.noteKey,
        stakeState: this.stakeKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      });
    },
  };
}
