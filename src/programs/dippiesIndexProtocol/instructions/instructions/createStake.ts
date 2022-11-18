import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateStakeAccounts {
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
  systemProgram: PublicKey
  rent: PublicKey
}

export function createStake(accounts: CreateStakeAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.forestAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.forest, isSigner: false, isWritable: false },
    { pubkey: accounts.voteMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tree, isSigner: false, isWritable: false },
    { pubkey: accounts.node, isSigner: false, isWritable: false },
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
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([201, 134, 55, 171, 2, 136, 228, 226])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
