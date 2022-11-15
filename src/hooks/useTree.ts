import * as anchor from "@project-serum/anchor";

import { DIPPIES_ROOT, DIPPIES_TOKEN } from "../utils/ids";
import { Node, Root, Tree } from "../programs/dippiesIndexProtocol/accounts";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

import { PROGRAM_ID as DIP_PROGRAM_ID } from "../programs/dippiesIndexProtocol/programId";
import { PublicKey } from "@solana/web3.js";
import { TreeDeaRoot } from "../programs/dippiesIndexProtocol/root";
import { TreeWithKey } from "./useRoot";

export interface NodeWithKey extends Node {
  key: PublicKey;
}

export default function useTree(treeKey: anchor.web3.PublicKey) {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [tree, setTree] = useState<TreeWithKey>();
  const [nodes, setNodes] = useState<NodeWithKey[]>();

  const fetchTree = async () => {
    if (!connection || !wallet?.publicKey) return;

    const res = await Tree.fetch(connection, treeKey);

    if (res) setTree({ ...res, key: treeKey } as any);
  };
  useEffect(() => {
    if (!tree) fetchTree();
  }, [wallet?.publicKey]);

  return { tree, nodes };
}
