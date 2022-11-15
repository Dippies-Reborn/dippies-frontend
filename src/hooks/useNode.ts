import * as anchor from "@project-serum/anchor";

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

import { Node } from "../programs/dippiesIndexProtocol/accounts";
import { NodeWithKey } from "./useTree";

export default function useNode(nodeKey: anchor.web3.PublicKey) {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [parent, setParent] = useState<NodeWithKey>();
  const [node, setNode] = useState<NodeWithKey>();
  const [children, setChildren] = useState<NodeWithKey[]>();

  const fetchNode = async () => {
    if (!connection || !wallet?.publicKey) return;

    const res = await Node.fetch(connection, nodeKey);

    if (res) setNode({ ...res, key: nodeKey } as any);
  };
  useEffect(() => {
    if (!node) fetchNode();
  }, [wallet?.publicKey, node]);

  const fetchParent = async () => {
    if (!connection || !wallet?.publicKey || !node) return;

    try {
      const res = await Node.fetch(connection, node.parent);

      if (res) setParent({ ...res, key: nodeKey } as any);
    } catch {}
  };
  useEffect(() => {
    if (!parent) fetchParent();
  }, [wallet?.publicKey, node]);

  const fetchChildren = async () => {
    if (!connection || !wallet?.publicKey || !node) return;

    const res = await Promise.all(
      node.children
        .map(async (child) => ({
          ...(await Node.fetch(connection, child)),
          key: child,
        }))
        .filter(Boolean)
    );

    setChildren(res as any);
  };
  useEffect(() => {
    if (!children) fetchChildren();
  }, [wallet?.publicKey, node]);

  return { node, children, parent, fetchChildren };
}
