import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { AnchorProvider, BN } from "@project-serum/anchor";
import {
  NOTE_SEED,
  ROOT_AUTHORITY_SEED,
  ROOT_SEED,
  STAKE_SEED,
} from "./constants";
import { Node, Note, Root, Tree } from "./accounts";
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import { createStake, updateStake } from "./instructions";

import { PROGRAM_ID as DIP_PROGRAM_ID } from "./programId";
import { StakeAccount } from "./accounts/StakeAccount";

export class TreeDeaStakeAccount {
  signer: PublicKey;
  rootId: PublicKey;
  rootKey: PublicKey;
  rootAuthority: PublicKey;
  voteMint: PublicKey;
  voteAccount: PublicKey;
  tree: PublicKey;
  node: PublicKey;
  note: PublicKey;
  stakeAccount: PublicKey;

  constructor(
    signer: PublicKey,
    rootId: PublicKey,
    voteMint: PublicKey,
    tree: PublicKey,
    node: PublicKey,
    note: PublicKey
  ) {
    this.signer = signer;
    this.rootId = rootId;
    this.rootKey = PublicKey.findProgramAddressSync(
      [Buffer.from(ROOT_SEED), rootId.toBuffer()],
      DIP_PROGRAM_ID
    )[0];
    this.rootAuthority = PublicKey.findProgramAddressSync(
      [Buffer.from(ROOT_AUTHORITY_SEED), this.rootKey.toBuffer()],
      DIP_PROGRAM_ID
    )[0];
    this.voteMint = voteMint;
    this.voteAccount = getAssociatedTokenAddressSync(
      voteMint,
      this.rootAuthority,
      true
    );
    this.tree = tree;
    this.node = node;
    this.note = note;
    this.stakeAccount = PublicKey.findProgramAddressSync(
      [Buffer.from(STAKE_SEED), this.note.toBuffer(), this.signer.toBuffer()],
      DIP_PROGRAM_ID
    )[0];
  }

  static async fromNote(provider: AnchorProvider, note: Note) {
    const node = await Node.fetch(provider.connection, note.parent);
    if (!node) return;

    const tree = await Tree.fetch(provider.connection, node.tree);
    if (!tree) return;

    const root = await Root.fetch(provider.connection, tree.root);
    if (!root) return;

    return new TreeDeaStakeAccount(
      provider.publicKey,
      root.id,
      root.voteMint,
      node.tree,
      note.parent,
      PublicKey.findProgramAddressSync(
        [Buffer.from(NOTE_SEED), node.tree.toBuffer(), note.id.toBuffer()],
        DIP_PROGRAM_ID
      )[0]
    );
  }

  static key(noteKey: PublicKey, signer: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(STAKE_SEED), noteKey.toBuffer(), signer.toBuffer()],
      DIP_PROGRAM_ID
    )[0];
  }

  instruction = {
    createStake: () => {
      return createStake({
        signer: this.signer,
        rootAuthority: this.rootAuthority,
        root: this.rootKey,
        voteMint: this.voteMint,
        tree: this.tree,
        node: this.node,
        note: this.note,
        stakeAccount: TreeDeaStakeAccount.key(this.note, this.signer),
        stakerAccount: getAssociatedTokenAddressSync(
          this.voteMint,
          this.signer
        ),
        voteAccount: getAssociatedTokenAddressSync(
          this.voteMint,
          this.rootAuthority,
          true
        ),
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      });
    },
    updateStake: (stake: BN) => {
      return updateStake(
        { stake },
        {
          signer: this.signer,
          rootAuthority: this.rootAuthority,
          root: this.rootKey,
          voteMint: this.voteMint,
          tree: this.tree,
          node: this.node,
          note: this.note,
          stakeAccount: TreeDeaStakeAccount.key(this.note, this.signer),
          stakerAccount: getAssociatedTokenAddressSync(
            this.voteMint,
            this.signer
          ),
          voteAccount: getAssociatedTokenAddressSync(
            this.voteMint,
            this.rootAuthority,
            true
          ),
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        }
      );
    },
  };
}
