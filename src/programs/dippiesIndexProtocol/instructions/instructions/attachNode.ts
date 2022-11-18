import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface AttachNodeAccounts {
  signer: PublicKey
  /** The forest */
  forest: PublicKey
  /** The tree */
  tree: PublicKey
  /** The parent node to attach to */
  parentNode: PublicKey
  /** The attached node */
  node: PublicKey
  /** Common Solana programs */
  systemProgram: PublicKey
  rent: PublicKey
}

export function attachNode(accounts: AttachNodeAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.forest, isSigner: false, isWritable: false },
    { pubkey: accounts.tree, isSigner: false, isWritable: false },
    { pubkey: accounts.parentNode, isSigner: false, isWritable: true },
    { pubkey: accounts.node, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([222, 53, 143, 98, 138, 62, 148, 196])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
