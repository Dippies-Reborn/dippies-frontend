import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface BribeClaimFields {
  /** The bribe being claimed */
  bribe: PublicKey
  /** The claimant */
  claimant: PublicKey
  /** The accumulated shares at the last update */
  accumulatedStake: BN
  /** The last time the bribe was updated */
  lastUpdate: BN
}

export interface BribeClaimJSON {
  /** The bribe being claimed */
  bribe: string
  /** The claimant */
  claimant: string
  /** The accumulated shares at the last update */
  accumulatedStake: string
  /** The last time the bribe was updated */
  lastUpdate: string
}

export class BribeClaim {
  /** The bribe being claimed */
  readonly bribe: PublicKey
  /** The claimant */
  readonly claimant: PublicKey
  /** The accumulated shares at the last update */
  readonly accumulatedStake: BN
  /** The last time the bribe was updated */
  readonly lastUpdate: BN

  static readonly discriminator = Buffer.from([
    232, 205, 168, 216, 148, 55, 115, 118,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("bribe"),
    borsh.publicKey("claimant"),
    borsh.u64("accumulatedStake"),
    borsh.i64("lastUpdate"),
  ])

  constructor(fields: BribeClaimFields) {
    this.bribe = fields.bribe
    this.claimant = fields.claimant
    this.accumulatedStake = fields.accumulatedStake
    this.lastUpdate = fields.lastUpdate
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<BribeClaim | null> {
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
  ): Promise<Array<BribeClaim | null>> {
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

  static decode(data: Buffer): BribeClaim {
    if (!data.slice(0, 8).equals(BribeClaim.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = BribeClaim.layout.decode(data.slice(8))

    return new BribeClaim({
      bribe: dec.bribe,
      claimant: dec.claimant,
      accumulatedStake: dec.accumulatedStake,
      lastUpdate: dec.lastUpdate,
    })
  }

  toJSON(): BribeClaimJSON {
    return {
      bribe: this.bribe.toString(),
      claimant: this.claimant.toString(),
      accumulatedStake: this.accumulatedStake.toString(),
      lastUpdate: this.lastUpdate.toString(),
    }
  }

  static fromJSON(obj: BribeClaimJSON): BribeClaim {
    return new BribeClaim({
      bribe: new PublicKey(obj.bribe),
      claimant: new PublicKey(obj.claimant),
      accumulatedStake: new BN(obj.accumulatedStake),
      lastUpdate: new BN(obj.lastUpdate),
    })
  }
}
