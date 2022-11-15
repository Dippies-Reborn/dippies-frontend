import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface StakeAccountFields {
  staker: PublicKey
  stake: BN
  note: PublicKey
}

export interface StakeAccountJSON {
  staker: string
  stake: string
  note: string
}

export class StakeAccount {
  readonly staker: PublicKey
  readonly stake: BN
  readonly note: PublicKey

  static readonly discriminator = Buffer.from([
    80, 158, 67, 124, 50, 189, 192, 255,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("staker"),
    borsh.u64("stake"),
    borsh.publicKey("note"),
  ])

  constructor(fields: StakeAccountFields) {
    this.staker = fields.staker
    this.stake = fields.stake
    this.note = fields.note
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<StakeAccount | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<StakeAccount | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): StakeAccount {
    if (!data.slice(0, 8).equals(StakeAccount.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = StakeAccount.layout.decode(data.slice(8))

    return new StakeAccount({
      staker: dec.staker,
      stake: dec.stake,
      note: dec.note,
    })
  }

  toJSON(): StakeAccountJSON {
    return {
      staker: this.staker.toString(),
      stake: this.stake.toString(),
      note: this.note.toString(),
    }
  }

  static fromJSON(obj: StakeAccountJSON): StakeAccount {
    return new StakeAccount({
      staker: new PublicKey(obj.staker),
      stake: new BN(obj.stake),
      note: new PublicKey(obj.note),
    })
  }
}
