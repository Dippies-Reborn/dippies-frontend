import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateNoteArgs {
  id: PublicKey
  website: string
  image: string
  description: string
}

export interface CreateNoteAccounts {
  signer: PublicKey
  /** The global forest */
  forest: PublicKey
  /** The tree */
  tree: PublicKey
  /** The node to attach to */
  node: PublicKey
  /** The new note */
  note: PublicKey
  /** Common Solana programs */
  systemProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([
  borsh.publicKey("id"),
  borsh.str("website"),
  borsh.str("image"),
  borsh.str("description"),
])

export function createNote(args: CreateNoteArgs, accounts: CreateNoteAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.forest, isSigner: false, isWritable: false },
    { pubkey: accounts.tree, isSigner: false, isWritable: false },
    { pubkey: accounts.node, isSigner: false, isWritable: false },
    { pubkey: accounts.note, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([103, 2, 208, 242, 86, 156, 151, 107])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      id: args.id,
      website: args.website,
      image: args.image,
      description: args.description,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
