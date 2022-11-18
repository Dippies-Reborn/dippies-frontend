import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface TreeFields {
  /** The forest this tree grows in */
  forest: PublicKey
  /** The root node of the tree */
  rootNode: PublicKey
  /** Title of the tree */
  title: string
  /** Total staked on this tree */
  stake: BN
}

export interface TreeJSON {
  /** The forest this tree grows in */
  forest: string
  /** The root node of the tree */
  rootNode: string
  /** Title of the tree */
  title: string
  /** Total staked on this tree */
  stake: string
}

export class Tree {
  /** The forest this tree grows in */
  readonly forest: PublicKey
  /** The root node of the tree */
  readonly rootNode: PublicKey
  /** Title of the tree */
  readonly title: string
  /** Total staked on this tree */
  readonly stake: BN

  static readonly discriminator = Buffer.from([
    100, 9, 213, 154, 6, 136, 109, 55,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("forest"),
    borsh.publicKey("rootNode"),
    borsh.str("title"),
    borsh.u64("stake"),
  ])

  constructor(fields: TreeFields) {
    this.forest = fields.forest
    this.rootNode = fields.rootNode
    this.title = fields.title
    this.stake = fields.stake
  }

  static async fetch(c: Connection, address: PublicKey): Promise<Tree | null> {
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
  ): Promise<Array<Tree | null>> {
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

  static decode(data: Buffer): Tree {
    if (!data.slice(0, 8).equals(Tree.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Tree.layout.decode(data.slice(8))

    return new Tree({
      forest: dec.forest,
      rootNode: dec.rootNode,
      title: dec.title,
      stake: dec.stake,
    })
  }

  toJSON(): TreeJSON {
    return {
      forest: this.forest.toString(),
      rootNode: this.rootNode.toString(),
      title: this.title,
      stake: this.stake.toString(),
    }
  }

  static fromJSON(obj: TreeJSON): Tree {
    return new Tree({
      forest: new PublicKey(obj.forest),
      rootNode: new PublicKey(obj.rootNode),
      title: obj.title,
      stake: new BN(obj.stake),
    })
  }
}
