import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateRootArgs {
  id: PublicKey
}

export interface CreateRootAccounts {
  signer: PublicKey
  /** The account that manages tokens */
  rootAuthority: PublicKey
  /** The global root */
  root: PublicKey
  /** The token used to vote for nodes and tags */
  voteMint: PublicKey
  /** The account storing vote tokens */
  voteAccount: PublicKey
  /** Common Solana programs */
  tokenProgram: PublicKey
  associatedTokenProgram: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([borsh.publicKey("id")])

export function createRoot(args: CreateRootArgs, accounts: CreateRootAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.rootAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.root, isSigner: false, isWritable: true },
    { pubkey: accounts.voteMint, isSigner: false, isWritable: false },
    { pubkey: accounts.voteAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([115, 195, 96, 208, 249, 205, 56, 27])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      id: args.id,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
