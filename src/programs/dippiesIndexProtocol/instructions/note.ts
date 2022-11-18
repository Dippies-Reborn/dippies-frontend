import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { BRIBE_CLAIM_SEED, BRIBE_SEED, NOTE_SEED } from "./constants";
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import {
  attachNote,
  claimBribe,
  createNote,
  moveNote,
  replaceNote,
  setBribe,
} from "./instructions";

import { BN } from "@project-serum/anchor";
import { PROGRAM_ID as DIP_PROGRAM_ID } from "./programId";
import { DipNode } from "./node";
import { DipStakeState } from "./stakeState";

export class DipNote {
  node: DipNode;
  id: PublicKey;
  noteKey: PublicKey;

  constructor(node: DipNode, noteId: PublicKey) {
    this.node = node;
    this.id = noteId;
    this.noteKey = PublicKey.findProgramAddressSync(
      [
        Buffer.from(NOTE_SEED),
        this.node.tree.treeKey.toBuffer(),
        this.id.toBuffer(),
      ],
      DIP_PROGRAM_ID
    )[0];
  }

  bribeKey(mint: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(BRIBE_SEED), this.noteKey.toBuffer(), mint.toBuffer()],
      DIP_PROGRAM_ID
    )[0];
  }
  bribeClaimKey(mint: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from(BRIBE_CLAIM_SEED),
        this.noteKey.toBuffer(),
        mint.toBuffer(),
        this.node.tree.forest.signer.toBuffer(),
      ],
      DIP_PROGRAM_ID
    )[0];
  }

  instruction = {
    createNote: (website: string, image: string, description: string) => {
      return createNote(
        { website, image, id: this.id, description },
        {
          signer: this.node.tree.forest.signer,
          forest: this.node.tree.forest.forestKey,
          tree: this.node.tree.treeKey,
          note: this.noteKey,
          node: this.node.nodeKey,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        }
      );
    },
    attachNote: () => {
      return attachNote({
        signer: this.node.tree.forest.signer,
        forest: this.node.tree.forest.forestKey,
        tree: this.node.tree.treeKey,
        note: this.noteKey,
        node: this.node.nodeKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      });
    },
    moveNote: (destinationNode: PublicKey) => {
      return moveNote({
        signer: this.node.tree.forest.signer,
        forest: this.node.tree.forest.forestKey,
        tree: this.node.tree.treeKey,
        note: this.noteKey,
        sourceNode: this.node.nodeKey,
        destinationNode,
        systemProgram: SystemProgram.programId,
      });
    },
    replaceNote: (targetNote: PublicKey) => {
      return replaceNote({
        signer: this.node.tree.forest.signer,
        forest: this.node.tree.forest.forestKey,
        tree: this.node.tree.treeKey,
        node: this.node.nodeKey,
        weakNote: targetNote,
        note: this.noteKey,
        systemProgram: SystemProgram.programId,
      });
    },
    setBribe: (bribeMint: PublicKey, amount: BN) => {
      return setBribe(
        { amount },
        {
          signer: this.node.tree.forest.signer,
          forestAuthority: this.node.tree.forest.forestAuthority,
          forest: this.node.tree.forest.forestKey,
          tree: this.node.tree.treeKey,
          node: this.node.nodeKey,
          note: this.noteKey,
          stakeState: DipStakeState.key(
            this.noteKey,
            this.node.tree.forest.signer
          ),
          bribeMint,
          bribe: this.bribeKey(bribeMint),
          briberAccount: getAssociatedTokenAddressSync(
            bribeMint,
            this.node.tree.forest.signer,
            true
          ),
          bribeAccount: getAssociatedTokenAddressSync(
            bribeMint,
            this.node.tree.forest.forestAuthority,
            true
          ),
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          systemProgram: SystemProgram.programId,
        }
      );
    },
    claimBribe: (bribeMint: PublicKey) => {
      return claimBribe({
        signer: this.node.tree.forest.signer,
        forestAuthority: this.node.tree.forest.forestAuthority,
        forest: this.node.tree.forest.forestKey,
        tree: this.node.tree.treeKey,
        node: this.node.nodeKey,
        note: this.noteKey,
        stakeState: DipStakeState.key(
          this.noteKey,
          this.node.tree.forest.signer
        ),
        bribeMint,
        bribe: this.bribeKey(bribeMint),
        bribeClaim: this.bribeClaimKey(bribeMint),
        briberAccount: getAssociatedTokenAddressSync(
          bribeMint,
          this.node.tree.forest.signer,
          true
        ),
        bribeAccount: getAssociatedTokenAddressSync(
          bribeMint,
          this.node.tree.forest.forestAuthority,
          true
        ),
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
      });
    },
  };
}
