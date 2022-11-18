import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  FOREST_AUTHORITY_SEED,
  FOREST_SEED,
  NODE_SEED,
  TREE_SEED,
} from "./constants";
import { SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import { createForest, createTree } from "./instructions";

import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID as TREEDEA_ID } from "./programId";

export class DipForest {
  signer: PublicKey;
  forestId: PublicKey;
  forestKey: PublicKey;
  forestAuthority: PublicKey;
  voteMint: PublicKey;
  voteAccount: PublicKey;
  admin: PublicKey;
  treeCreationFee: BN;

  constructor(
    signer: PublicKey,
    forestId: PublicKey,
    voteMint: PublicKey,
    admin: PublicKey,
    treeCreationFee: BN
  ) {
    this.signer = signer;
    this.forestId = forestId;
    this.forestKey = PublicKey.findProgramAddressSync(
      [Buffer.from(FOREST_SEED), forestId.toBuffer()],
      TREEDEA_ID
    )[0];
    this.forestAuthority = PublicKey.findProgramAddressSync(
      [Buffer.from(FOREST_AUTHORITY_SEED), this.forestKey.toBuffer()],
      TREEDEA_ID
    )[0];
    this.voteMint = voteMint;
    this.voteAccount = getAssociatedTokenAddressSync(
      voteMint,
      this.forestAuthority,
      true
    );
    this.admin = admin;
    this.treeCreationFee = treeCreationFee;
  }

  instruction = {
    createForest: () => {
      return createForest(
        {
          id: this.forestId,
          admin: this.admin,
          treeCreationFee: this.treeCreationFee,
        },
        {
          signer: this.signer,
          forestAuthority: this.forestAuthority,
          forest: this.forestKey,
          voteMint: this.voteMint,
          voteAccount: this.voteAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        }
      );
    },
    createTree: (tag: string) => {
      const [tree] = PublicKey.findProgramAddressSync(
        [Buffer.from(TREE_SEED), this.forestKey.toBuffer(), Buffer.from(tag)],
        TREEDEA_ID
      );
      const [rootNode] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(NODE_SEED),
          tree.toBuffer(),
          PublicKey.default.toBuffer(),
          Buffer.from(tag),
        ],
        TREEDEA_ID
      );

      return createTree(
        { tag },
        {
          signer: this.signer,
          forest: this.forestKey,
          admin: this.admin,
          forestAuthority: this.forestAuthority,
          voteMint: this.voteMint,
          creatorAccount: getAssociatedTokenAddressSync(
            this.voteMint,
            this.signer
          ),
          adminAccount: getAssociatedTokenAddressSync(
            this.voteMint,
            this.admin
          ),
          tree,
          rootNode,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        }
      );
    },
  };
}
