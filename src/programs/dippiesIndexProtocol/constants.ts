import { PublicKey } from "@solana/web3.js";
import idl from "./dippies_index_protocol.json";

export const DIP_PROGRAM_ID: PublicKey = new PublicKey(idl.metadata.address);

export const FOREST_AUTHORITY_SEED = idl.constants[0].value.replaceAll('"', "");
export const FOREST_SEED = idl.constants[1].value.replaceAll('"', "");
export const TREE_SEED = idl.constants[2].value.replaceAll('"', "");
export const NODE_SEED = idl.constants[3].value.replaceAll('"', "");
export const NOTE_SEED = idl.constants[4].value.replaceAll('"', "");
export const STAKE_SEED = idl.constants[5].value.replaceAll('"', "");
export const BRIBE_SEED = idl.constants[6].value.replaceAll('"', "");
export const BRIBE_CLAIM_SEED = idl.constants[7].value.replaceAll('"', "");

export const MAX_TAGS = Number(idl.constants[8].value);
export const MAX_TAG_LENGTH = Number(idl.constants[9].value);
export const MAX_NOTES_PER_NODE = Number(idl.constants[10].value);
export const MAX_CHILD_PER_NODE = Number(idl.constants[11].value);
export const MAX_URI_LENGTH = Number(idl.constants[12].value);
export const MAX_DESCRIPTION_LENGTH = Number(idl.constants[13].value);
