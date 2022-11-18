import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface StakeStateFields {
  /** The staker owning this account */
  staker: PublicKey
  /** The note staked on */
  note: PublicKey
  /** The amount currently staked */
  stake: BN
  /** The amount currently staked */
  accumulatedStake: BN
  /** The last time this account was updated */
  lastUpdate: BN
}

export interface StakeStateJSON {
  /** The staker owning this account */
  staker: string
  /** The note staked on */
  note: string
  /** The amount currently staked */
  stake: string
  /** The amount currently staked */
  accumulatedStake: string
  /** The last time this account was updated */
  lastUpdate: string
}

export class StakeState {
  /** The staker owning this account */
  readonly staker: PublicKey
  /** The note staked on */
  readonly note: PublicKey
  /** The amount currently staked */
  readonly stake: BN
  /** The amount currently staked */
  readonly accumulatedStake: BN
  /** The last time this account was updated */
  readonly lastUpdate: BN

  static readonly discriminator = Buffer.from([
    108, 10, 236, 72, 1, 88, 133, 92,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("staker"),
    borsh.publicKey("note"),
    borsh.u64("stake"),
    borsh.u64("accumulatedStake"),
    borsh.i64("lastUpdate"),
  ])

  constructor(fields: StakeStateFields) {
    this.staker = fields.staker
    this.note = fields.note
    this.stake = fields.stake
    this.accumulatedStake = fields.accumulatedStake
    this.lastUpdate = fields.lastUpdate
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<StakeState | null> {
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
  ): Promise<Array<StakeState | null>> {
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

  static decode(data: Buffer): StakeState {
    if (!data.slice(0, 8).equals(StakeState.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = StakeState.layout.decode(data.slice(8))

    return new StakeState({
      staker: dec.staker,
      note: dec.note,
      stake: dec.stake,
      accumulatedStake: dec.accumulatedStake,
      lastUpdate: dec.lastUpdate,
    })
  }

  toJSON(): StakeStateJSON {
    return {
      staker: this.staker.toString(),
      note: this.note.toString(),
      stake: this.stake.toString(),
      accumulatedStake: this.accumulatedStake.toString(),
      lastUpdate: this.lastUpdate.toString(),
    }
  }

  static fromJSON(obj: StakeStateJSON): StakeState {
    return new StakeState({
      staker: new PublicKey(obj.staker),
      note: new PublicKey(obj.note),
      stake: new BN(obj.stake),
      accumulatedStake: new BN(obj.accumulatedStake),
      lastUpdate: new BN(obj.lastUpdate),
    })
  }
}
