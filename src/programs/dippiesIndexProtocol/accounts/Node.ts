import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface NodeFields {
  /** The tree this node belongs to */
  tree: PublicKey
  /** The parent of this node */
  parent: PublicKey
  /** Children nodes */
  children: Array<PublicKey>
  /** The total staked on notes of this node */
  stake: BN
  /** The set of tags of this node */
  tags: Array<string>
  /** The set of notes currently attached to this node */
  notes: Array<PublicKey>
}

export interface NodeJSON {
  /** The tree this node belongs to */
  tree: string
  /** The parent of this node */
  parent: string
  /** Children nodes */
  children: Array<string>
  /** The total staked on notes of this node */
  stake: string
  /** The set of tags of this node */
  tags: Array<string>
  /** The set of notes currently attached to this node */
  notes: Array<string>
}

export class Node {
  /** The tree this node belongs to */
  readonly tree: PublicKey
  /** The parent of this node */
  readonly parent: PublicKey
  /** Children nodes */
  readonly children: Array<PublicKey>
  /** The total staked on notes of this node */
  readonly stake: BN
  /** The set of tags of this node */
  readonly tags: Array<string>
  /** The set of notes currently attached to this node */
  readonly notes: Array<PublicKey>

  static readonly discriminator = Buffer.from([208, 53, 1, 3, 49, 122, 180, 49])

  static readonly layout = borsh.struct([
    borsh.publicKey("tree"),
    borsh.publicKey("parent"),
    borsh.vec(borsh.publicKey(), "children"),
    borsh.u64("stake"),
    borsh.vec(borsh.str(), "tags"),
    borsh.vec(borsh.publicKey(), "notes"),
  ])

  constructor(fields: NodeFields) {
    this.tree = fields.tree
    this.parent = fields.parent
    this.children = fields.children
    this.stake = fields.stake
    this.tags = fields.tags
    this.notes = fields.notes
  }

  static async fetch(c: Connection, address: PublicKey): Promise<Node | null> {
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
  ): Promise<Array<Node | null>> {
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

  static decode(data: Buffer): Node {
    if (!data.slice(0, 8).equals(Node.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Node.layout.decode(data.slice(8))

    return new Node({
      tree: dec.tree,
      parent: dec.parent,
      children: dec.children,
      stake: dec.stake,
      tags: dec.tags,
      notes: dec.notes,
    })
  }

  toJSON(): NodeJSON {
    return {
      tree: this.tree.toString(),
      parent: this.parent.toString(),
      children: this.children.map((item) => item.toString()),
      stake: this.stake.toString(),
      tags: this.tags,
      notes: this.notes.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: NodeJSON): Node {
    return new Node({
      tree: new PublicKey(obj.tree),
      parent: new PublicKey(obj.parent),
      children: obj.children.map((item) => new PublicKey(item)),
      stake: new BN(obj.stake),
      tags: obj.tags,
      notes: obj.notes.map((item) => new PublicKey(item)),
    })
  }
}
