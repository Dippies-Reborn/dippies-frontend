import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateNodeArgs {
  tag: string
}

export interface CreateNodeAccounts {
  signer: PublicKey
  /** The global root */
  root: PublicKey
  /** The tree */
  tree: PublicKey
  /** The parent node to attach to */
  parentNode: PublicKey
  /** The new node */
  node: PublicKey
  /** Common Solana programs */
  systemProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([borsh.str("tag")])

export function createNode(args: CreateNodeArgs, accounts: CreateNodeAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.root, isSigner: false, isWritable: false },
    { pubkey: accounts.tree, isSigner: false, isWritable: false },
    { pubkey: accounts.parentNode, isSigner: false, isWritable: false },
    { pubkey: accounts.node, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([20, 183, 134, 233, 51, 51, 115, 83])
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
