import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateForestArgs {
  id: PublicKey
  admin: PublicKey
  treeCreationFee: BN
}

export interface CreateForestAccounts {
  signer: PublicKey
  /** The account that manages tokens */
  forestAuthority: PublicKey
  /** The forest */
  forest: PublicKey
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

export const layout = borsh.struct([
  borsh.publicKey("id"),
  borsh.publicKey("admin"),
  borsh.u64("treeCreationFee"),
])

export function createForest(
  args: CreateForestArgs,
  accounts: CreateForestAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.forestAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.forest, isSigner: false, isWritable: true },
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
  const identifier = Buffer.from([114, 120, 10, 96, 7, 35, 152, 115])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      id: args.id,
      admin: args.admin,
      treeCreationFee: args.treeCreationFee,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
