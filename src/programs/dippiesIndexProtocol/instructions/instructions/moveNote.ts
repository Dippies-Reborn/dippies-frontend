import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface MoveNoteAccounts {
  signer: PublicKey
  /** The forest */
  forest: PublicKey
  /** The tree */
  tree: PublicKey
  /** The node the note is currently attached to */
  sourceNode: PublicKey
  /** The node the note will be attached to */
  destinationNode: PublicKey
  /** The new note */
  note: PublicKey
  /** Common Solana programs */
  systemProgram: PublicKey
}

export function moveNote(accounts: MoveNoteAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.forest, isSigner: false, isWritable: false },
    { pubkey: accounts.tree, isSigner: false, isWritable: false },
    { pubkey: accounts.sourceNode, isSigner: false, isWritable: true },
    { pubkey: accounts.destinationNode, isSigner: false, isWritable: false },
    { pubkey: accounts.note, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([241, 53, 131, 127, 195, 204, 16, 220])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
