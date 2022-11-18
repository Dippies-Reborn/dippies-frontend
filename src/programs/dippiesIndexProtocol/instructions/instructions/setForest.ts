import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SetForestArgs {
  admin: PublicKey
  treeCreationFee: BN
}

export interface SetForestAccounts {
  signer: PublicKey
  /** The forest */
  forest: PublicKey
  /** Common Solana programs */
  tokenProgram: PublicKey
  associatedTokenProgram: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([
  borsh.publicKey("admin"),
  borsh.u64("treeCreationFee"),
])

export function setForest(args: SetForestArgs, accounts: SetForestAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.forest, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([205, 72, 135, 24, 125, 146, 35, 2])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      admin: args.admin,
      treeCreationFee: args.treeCreationFee,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
