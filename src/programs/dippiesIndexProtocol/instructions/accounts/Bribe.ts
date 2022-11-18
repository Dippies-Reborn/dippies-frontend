import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface BribeFields {
  /** The note receiving the bribe */
  note: PublicKey
  /** The mint of the bribe */
  bribeMint: PublicKey
  /** Claimable bribe amount */
  amount: BN
  /** The accumulated shares at the last update */
  accumulatedStake: BN
  /** The last time the bribe was updated */
  lastUpdate: BN
}

export interface BribeJSON {
  /** The note receiving the bribe */
  note: string
  /** The mint of the bribe */
  bribeMint: string
  /** Claimable bribe amount */
  amount: string
  /** The accumulated shares at the last update */
  accumulatedStake: string
  /** The last time the bribe was updated */
  lastUpdate: string
}

export class Bribe {
  /** The note receiving the bribe */
  readonly note: PublicKey
  /** The mint of the bribe */
  readonly bribeMint: PublicKey
  /** Claimable bribe amount */
  readonly amount: BN
  /** The accumulated shares at the last update */
  readonly accumulatedStake: BN
  /** The last time the bribe was updated */
  readonly lastUpdate: BN

  static readonly discriminator = Buffer.from([
    123, 25, 44, 23, 111, 217, 65, 73,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("note"),
    borsh.publicKey("bribeMint"),
    borsh.u64("amount"),
    borsh.u64("accumulatedStake"),
    borsh.i64("lastUpdate"),
  ])

  constructor(fields: BribeFields) {
    this.note = fields.note
    this.bribeMint = fields.bribeMint
    this.amount = fields.amount
    this.accumulatedStake = fields.accumulatedStake
    this.lastUpdate = fields.lastUpdate
  }

  static async fetch(c: Connection, address: PublicKey): Promise<Bribe | null> {
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
  ): Promise<Array<Bribe | null>> {
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

  static decode(data: Buffer): Bribe {
    if (!data.slice(0, 8).equals(Bribe.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Bribe.layout.decode(data.slice(8))

    return new Bribe({
      note: dec.note,
      bribeMint: dec.bribeMint,
      amount: dec.amount,
      accumulatedStake: dec.accumulatedStake,
      lastUpdate: dec.lastUpdate,
    })
  }

  toJSON(): BribeJSON {
    return {
      note: this.note.toString(),
      bribeMint: this.bribeMint.toString(),
      amount: this.amount.toString(),
      accumulatedStake: this.accumulatedStake.toString(),
      lastUpdate: this.lastUpdate.toString(),
    }
  }

  static fromJSON(obj: BribeJSON): Bribe {
    return new Bribe({
      note: new PublicKey(obj.note),
      bribeMint: new PublicKey(obj.bribeMint),
      amount: new BN(obj.amount),
      accumulatedStake: new BN(obj.accumulatedStake),
      lastUpdate: new BN(obj.lastUpdate),
    })
  }
}
