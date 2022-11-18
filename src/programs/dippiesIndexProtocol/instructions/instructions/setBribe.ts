import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SetBribeArgs {
  amount: BN
}

export interface SetBribeAccounts {
  signer: PublicKey
  /** The account that manages tokens */
  forestAuthority: PublicKey
  /** The global forest */
  forest: PublicKey
  /** The tree */
  tree: PublicKey
  /** The node to attach to */
  node: PublicKey
  /** The bribed note */
  note: PublicKey
  /** The account storing vote tokens */
  stakeState: PublicKey
  /** The bribe */
  bribe: PublicKey
  /** The token used to bribe */
  bribeMint: PublicKey
  /** The account paying the bribe */
  briberAccount: PublicKey
  /** The account storing the bribe */
  bribeAccount: PublicKey
  /** Common Solana programs */
  tokenProgram: PublicKey
  associatedTokenProgram: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([borsh.u64("amount")])

export function setBribe(args: SetBribeArgs, accounts: SetBribeAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.forestAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.forest, isSigner: false, isWritable: false },
    { pubkey: accounts.tree, isSigner: false, isWritable: false },
    { pubkey: accounts.node, isSigner: false, isWritable: false },
    { pubkey: accounts.note, isSigner: false, isWritable: true },
    { pubkey: accounts.stakeState, isSigner: false, isWritable: true },
    { pubkey: accounts.bribe, isSigner: false, isWritable: true },
    { pubkey: accounts.bribeMint, isSigner: false, isWritable: false },
    { pubkey: accounts.briberAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.bribeAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([104, 208, 225, 167, 149, 56, 243, 176])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      amount: args.amount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
