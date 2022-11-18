import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface NoteFields {
  /** Unique noteidetifier */
  id: PublicKey
  /** The website the note points to */
  website: string
  /** Thecoverimage ofthe note */
  image: string
  /** A short description of the website the note points to */
  description: string
  /** The set of tags on this node */
  tags: Array<string>
  /** The node this note is attached to */
  parent: PublicKey
  /** The stake currently on this note */
  stake: BN
  /** The total stake accumulated per unit of time */
  accumulatedStake: BN
  /** The last time this note was updated */
  lastUpdate: BN
}

export interface NoteJSON {
  /** Unique noteidetifier */
  id: string
  /** The website the note points to */
  website: string
  /** Thecoverimage ofthe note */
  image: string
  /** A short description of the website the note points to */
  description: string
  /** The set of tags on this node */
  tags: Array<string>
  /** The node this note is attached to */
  parent: string
  /** The stake currently on this note */
  stake: string
  /** The total stake accumulated per unit of time */
  accumulatedStake: string
  /** The last time this note was updated */
  lastUpdate: string
}

export class Note {
  /** Unique noteidetifier */
  readonly id: PublicKey
  /** The website the note points to */
  readonly website: string
  /** Thecoverimage ofthe note */
  readonly image: string
  /** A short description of the website the note points to */
  readonly description: string
  /** The set of tags on this node */
  readonly tags: Array<string>
  /** The node this note is attached to */
  readonly parent: PublicKey
  /** The stake currently on this note */
  readonly stake: BN
  /** The total stake accumulated per unit of time */
  readonly accumulatedStake: BN
  /** The last time this note was updated */
  readonly lastUpdate: BN

  static readonly discriminator = Buffer.from([
    203, 75, 252, 196, 81, 210, 122, 126,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("id"),
    borsh.str("website"),
    borsh.str("image"),
    borsh.str("description"),
    borsh.vec(borsh.str(), "tags"),
    borsh.publicKey("parent"),
    borsh.u64("stake"),
    borsh.u64("accumulatedStake"),
    borsh.i64("lastUpdate"),
  ])

  constructor(fields: NoteFields) {
    this.id = fields.id
    this.website = fields.website
    this.image = fields.image
    this.description = fields.description
    this.tags = fields.tags
    this.parent = fields.parent
    this.stake = fields.stake
    this.accumulatedStake = fields.accumulatedStake
    this.lastUpdate = fields.lastUpdate
  }

  static async fetch(c: Connection, address: PublicKey): Promise<Note | null> {
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
  ): Promise<Array<Note | null>> {
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

  static decode(data: Buffer): Note {
    if (!data.slice(0, 8).equals(Note.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Note.layout.decode(data.slice(8))

    return new Note({
      id: dec.id,
      website: dec.website,
      image: dec.image,
      description: dec.description,
      tags: dec.tags,
      parent: dec.parent,
      stake: dec.stake,
      accumulatedStake: dec.accumulatedStake,
      lastUpdate: dec.lastUpdate,
    })
  }

  toJSON(): NoteJSON {
    return {
      id: this.id.toString(),
      website: this.website,
      image: this.image,
      description: this.description,
      tags: this.tags,
      parent: this.parent.toString(),
      stake: this.stake.toString(),
      accumulatedStake: this.accumulatedStake.toString(),
      lastUpdate: this.lastUpdate.toString(),
    }
  }

  static fromJSON(obj: NoteJSON): Note {
    return new Note({
      id: new PublicKey(obj.id),
      website: obj.website,
      image: obj.image,
      description: obj.description,
      tags: obj.tags,
      parent: new PublicKey(obj.parent),
      stake: new BN(obj.stake),
      accumulatedStake: new BN(obj.accumulatedStake),
      lastUpdate: new BN(obj.lastUpdate),
    })
  }
}
