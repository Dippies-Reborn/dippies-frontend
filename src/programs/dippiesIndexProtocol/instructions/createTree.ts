import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateTreeArgs {
  tag: string
}

export interface CreateTreeAccounts {
  signer: PublicKey
  /** The global root */
  root: PublicKey
  /** The tree */
  tree: PublicKey
  /** The root node of the new tree */
  rootNode: PublicKey
  /** Common Solana programs */
  systemProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([borsh.str("tag")])

export function createTree(args: CreateTreeArgs, accounts: CreateTreeAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.root, isSigner: false, isWritable: false },
    { pubkey: accounts.tree, isSigner: false, isWritable: true },
    { pubkey: accounts.rootNode, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([165, 83, 136, 142, 89, 202, 47, 220])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      tag: args.tag,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
