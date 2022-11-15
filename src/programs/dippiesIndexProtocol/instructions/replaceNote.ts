import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ReplaceNoteAccounts {
  signer: PublicKey
  /** The global root */
  root: PublicKey
  /** The tree */
  tree: PublicKey
  /** The node the note will be attached to */
  node: PublicKey
  /** The new note */
  note: PublicKey
  /** The new note */
  weakNote: PublicKey
  /** Common Solana programs */
  systemProgram: PublicKey
}

export function replaceNote(accounts: ReplaceNoteAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.root, isSigner: false, isWritable: false },
    { pubkey: accounts.tree, isSigner: false, isWritable: false },
    { pubkey: accounts.node, isSigner: false, isWritable: true },
    { pubkey: accounts.note, isSigner: false, isWritable: true },
    { pubkey: accounts.weakNote, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([57, 50, 234, 92, 148, 156, 171, 166])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
