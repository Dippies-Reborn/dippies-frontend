import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ForestFields {
  /** The ID of the forest */
  id: PublicKey
  /** The token used to vote for a tag */
  voteMint: PublicKey
  /** Admin of the forest */
  admin: PublicKey
  /** Cost to create a tree from this forest */
  treeCreationFee: BN
}

export interface ForestJSON {
  /** The ID of the forest */
  id: string
  /** The token used to vote for a tag */
  voteMint: string
  /** Admin of the forest */
  admin: string
  /** Cost to create a tree from this forest */
  treeCreationFee: string
}

export class Forest {
  /** The ID of the forest */
  readonly id: PublicKey
  /** The token used to vote for a tag */
  readonly voteMint: PublicKey
  /** Admin of the forest */
  readonly admin: PublicKey
  /** Cost to create a tree from this forest */
  readonly treeCreationFee: BN

  static readonly discriminator = Buffer.from([
    1, 221, 148, 237, 29, 139, 146, 24,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("id"),
    borsh.publicKey("voteMint"),
    borsh.publicKey("admin"),
    borsh.u64("treeCreationFee"),
  ])

  constructor(fields: ForestFields) {
    this.id = fields.id
    this.voteMint = fields.voteMint
    this.admin = fields.admin
    this.treeCreationFee = fields.treeCreationFee
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<Forest | null> {
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
  ): Promise<Array<Forest | null>> {
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

  static decode(data: Buffer): Forest {
    if (!data.slice(0, 8).equals(Forest.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Forest.layout.decode(data.slice(8))

    return new Forest({
      id: dec.id,
      voteMint: dec.voteMint,
      admin: dec.admin,
      treeCreationFee: dec.treeCreationFee,
    })
  }

  toJSON(): ForestJSON {
    return {
      id: this.id.toString(),
      voteMint: this.voteMint.toString(),
      admin: this.admin.toString(),
      treeCreationFee: this.treeCreationFee.toString(),
    }
  }

  static fromJSON(obj: ForestJSON): Forest {
    return new Forest({
      id: new PublicKey(obj.id),
      voteMint: new PublicKey(obj.voteMint),
      admin: new PublicKey(obj.admin),
      treeCreationFee: new BN(obj.treeCreationFee),
    })
  }
}
