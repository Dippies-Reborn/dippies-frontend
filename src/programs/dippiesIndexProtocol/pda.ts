import {
  BRIBE_CLAIM_SEED,
  BRIBE_SEED,
  FOREST_AUTHORITY_SEED,
  FOREST_SEED,
  NODE_SEED,
  NOTE_SEED,
  STAKE_SEED,
  TREE_SEED,
} from "./constants";

import { DIP_PROGRAM_ID } from "./";
import { PublicKey } from "@solana/web3.js";

export function getForestAddress(id: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(FOREST_SEED), id.toBuffer()],
    DIP_PROGRAM_ID
  )[0];
}

export function getForestAuthorityAddress(forest: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(FOREST_AUTHORITY_SEED), forest.toBuffer()],
    DIP_PROGRAM_ID
  )[0];
}

export function getTreeAddress(forest: PublicKey, title: string) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(TREE_SEED), forest.toBuffer(), Buffer.from(title)],
    DIP_PROGRAM_ID
  )[0];
}

export function getNodeAddress(
  tree: PublicKey,
  parent: PublicKey,
  tag: string
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(NODE_SEED),
      tree.toBuffer(),
      parent.toBuffer(),
      Buffer.from(tag),
    ],
    DIP_PROGRAM_ID
  )[0];
}

export function getNoteAddress(tree: PublicKey, noteId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(NOTE_SEED), tree.toBuffer(), noteId.toBuffer()],
    DIP_PROGRAM_ID
  )[0];
}

export function getStakeAddress(note: PublicKey, signer: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(STAKE_SEED), note.toBuffer(), signer.toBuffer()],
    DIP_PROGRAM_ID
  )[0];
}

export function getBribeAddress(note: PublicKey, bribeMint: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(BRIBE_SEED), note.toBuffer(), bribeMint.toBuffer()],
    DIP_PROGRAM_ID
  )[0];
}

export function getBribeClaimAddress(
  note: PublicKey,
  bribeMint: PublicKey,
  signer: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(BRIBE_CLAIM_SEED),
      note.toBuffer(),
      bribeMint.toBuffer(),
      signer.toBuffer(),
    ],
    DIP_PROGRAM_ID
  )[0];
}
