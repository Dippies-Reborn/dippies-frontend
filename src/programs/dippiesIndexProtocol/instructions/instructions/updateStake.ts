import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateStakeArgs {
  stake: BN
}

export interface UpdateStakeAccounts {
  signer: PublicKey
  /** The account that manages tokens */
  forestAuthority: PublicKey
  /** The forest */
  forest: PublicKey
  /** The token used to vote for nodes and tags */
  voteMint: PublicKey
  /** The tree */
  tree: PublicKey
  /** The node the note is attached to */
  node: PublicKey
  /** The attached note */
  note: PublicKey
  /** The account storing vote tokens */
  stakeState: PublicKey
  /** The account storing vote tokens */
  stakerAccount: PublicKey
  /** The account storing vote tokens */
  voteAccount: PublicKey
  /** Common Solana programs */
  tokenProgram: PublicKey
  associatedTokenProgram: PublicKey
  clock: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([borsh.i128("stake")])

export function updateStake(
  args: UpdateStakeArgs,
  accounts: UpdateStakeAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.forestAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.forest, isSigner: false, isWritable: false },
    { pubkey: accounts.voteMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tree, isSigner: false, isWritable: true },
    { pubkey: accounts.node, isSigner: false, isWritable: true },
    { pubkey: accounts.note, isSigner: false, isWritable: true },
    { pubkey: accounts.stakeState, isSigner: false, isWritable: true },
    { pubkey: accounts.stakerAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.voteAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.clock, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([248, 112, 197, 95, 233, 137, 105, 19])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      stake: args.stake,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
