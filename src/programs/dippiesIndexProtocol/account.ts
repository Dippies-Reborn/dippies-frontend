import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  AttachNodeAccounts,
  AttachNoteAccounts,
  ClaimBribeAccounts,
  CloseStakeAccounts,
  CreateForestAccounts,
  CreateNodeAccounts,
  CreateNoteAccounts,
  CreateStakeAccounts,
  CreateTreeAccounts,
  MoveNoteAccounts,
  ReplaceNoteAccounts,
  SetBribeAccounts,
  UpdateStakeAccounts,
} from "./types";
import {
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
} from "@solana/web3.js";
import {
  getBribeAddress,
  getBribeClaimAddress,
  getForestAddress,
  getForestAuthorityAddress,
  getNodeAddress,
  getNoteAddress,
  getStakeAddress,
  getTreeAddress,
} from "./pda";

import { PublicKey } from "@solana/web3.js";

export function getCreateForestAccounts(
  id: PublicKey,
  voteMint: PublicKey,
  signer: PublicKey
): CreateForestAccounts {
  const forest = getForestAddress(id);
  const authority = getForestAuthorityAddress(forest);
  return {
    signer,
    forestAuthority: authority,
    forest,
    voteMint,
    voteAccount: getAssociatedTokenAddressSync(voteMint, authority, true),
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getCreateTreeAccounts(
  forest: PublicKey,
  admin: PublicKey,
  voteMint: PublicKey,
  title: string,
  signer: PublicKey
): CreateTreeAccounts {
  const authority = getForestAuthorityAddress(forest);
  const tree = getTreeAddress(forest, title);
  const rootNode = getNodeAddress(tree, PublicKey.default, title);
  return {
    signer,
    forestAuthority: authority,
    forest,
    voteMint: voteMint,
    admin,
    creatorAccount: getAssociatedTokenAddressSync(voteMint, signer, true),
    adminAccount: getAssociatedTokenAddressSync(voteMint, admin, true),
    tree,
    rootNode,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getCreateNodeAccounts(
  forest: PublicKey,
  tree: PublicKey,
  parentNode: PublicKey,
  tag: string,
  signer: PublicKey
): CreateNodeAccounts {
  const node = getNodeAddress(tree, parentNode, tag);
  return {
    signer,
    forest,
    tree,
    parentNode,
    node,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getAttachNodeAccounts(
  forest: PublicKey,
  tree: PublicKey,
  parentNode: PublicKey,
  node: PublicKey,
  signer: PublicKey
): AttachNodeAccounts {
  return {
    signer,
    forest,
    tree,
    parentNode,
    node,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getCreateNoteAccounts(
  forest: PublicKey,
  tree: PublicKey,
  node: PublicKey,
  id: PublicKey,
  signer: PublicKey
): CreateNoteAccounts {
  const note = getNoteAddress(tree, id);
  return {
    signer,
    forest,
    tree,
    node,
    note,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getAttachNoteAccounts(
  forest: PublicKey,
  tree: PublicKey,
  node: PublicKey,
  note: PublicKey,
  signer: PublicKey
): AttachNoteAccounts {
  return {
    signer,
    forest,
    tree,
    node,
    note,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getMoveNoteAccounts(
  forest: PublicKey,
  tree: PublicKey,
  note: PublicKey,
  sourceNode: PublicKey,
  destinationNode: PublicKey,
  signer: PublicKey
): MoveNoteAccounts {
  return {
    signer,
    forest,
    tree,
    note,
    sourceNode,
    destinationNode,
    systemProgram: SystemProgram.programId,
  };
}

export function getReplaceNoteAccounts(
  forest: PublicKey,
  tree: PublicKey,
  node: PublicKey,
  note: PublicKey,
  weakNote: PublicKey,
  signer: PublicKey
): ReplaceNoteAccounts {
  return {
    signer,
    forest,
    tree,
    node,
    note,
    weakNote,
    systemProgram: SystemProgram.programId,
  };
}

export function getCreateStakeAccounts(
  forest: PublicKey,
  voteMint: PublicKey,
  tree: PublicKey,
  node: PublicKey,
  note: PublicKey,
  signer: PublicKey
): CreateStakeAccounts {
  const forestAuthority = getForestAuthorityAddress(forest);
  const stakeState = getStakeAddress(note, signer);
  return {
    signer,
    forestAuthority,
    forest,
    voteMint,
    tree,
    node,
    note,
    stakeState,
    stakerAccount: getAssociatedTokenAddressSync(voteMint, signer, true),
    voteAccount: getAssociatedTokenAddressSync(voteMint, forestAuthority, true),
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getUpdateStakeAccounts(
  forest: PublicKey,
  voteMint: PublicKey,
  tree: PublicKey,
  node: PublicKey,
  note: PublicKey,
  signer: PublicKey
): UpdateStakeAccounts {
  const forestAuthority = getForestAuthorityAddress(forest);
  const stakeState = getStakeAddress(note, signer);
  return {
    signer,
    forestAuthority,
    forest,
    voteMint,
    tree,
    node,
    note,
    stakeState,
    stakerAccount: getAssociatedTokenAddressSync(voteMint, signer, true),
    voteAccount: getAssociatedTokenAddressSync(voteMint, forestAuthority, true),
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    clock: SYSVAR_CLOCK_PUBKEY,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getCloseStakeAccounts(
  forest: PublicKey,
  tree: PublicKey,
  note: PublicKey,
  signer: PublicKey
): CloseStakeAccounts {
  const stakeState = getStakeAddress(note, signer);
  return {
    signer,
    forest,
    tree,
    note,
    stakeState,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getSetBribeAccounts(
  forest: PublicKey,
  tree: PublicKey,
  node: PublicKey,
  note: PublicKey,
  bribeMint: PublicKey,
  signer: PublicKey
): SetBribeAccounts {
  const forestAuthority = getForestAuthorityAddress(forest);
  const stakeState = getStakeAddress(note, signer);
  return {
    signer,
    forestAuthority,
    forest,
    tree,
    note,
    stakeState,
    node,
    bribe: getBribeAddress(note, bribeMint),
    bribeMint,
    briberAccount: getAssociatedTokenAddressSync(bribeMint, signer, true),
    bribeAccount: getAssociatedTokenAddressSync(
      bribeMint,
      forestAuthority,
      true
    ),
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getClaimBribeAccounts(
  forest: PublicKey,
  tree: PublicKey,
  node: PublicKey,
  note: PublicKey,
  bribeMint: PublicKey,
  signer: PublicKey
): ClaimBribeAccounts {
  const forestAuthority = getForestAuthorityAddress(forest);
  const stakeState = getStakeAddress(note, signer);
  return {
    signer,
    forestAuthority,
    forest,
    tree,
    note,
    stakeState,
    node,
    bribe: getBribeAddress(note, bribeMint),
    bribeClaim: getBribeClaimAddress(note, bribeMint, signer),
    bribeMint,
    briberAccount: getAssociatedTokenAddressSync(bribeMint, signer, true),
    bribeAccount: getAssociatedTokenAddressSync(
      bribeMint,
      forestAuthority,
      true
    ),
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}
