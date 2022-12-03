import { PublicKey } from "@solana/web3.js";
import useForest from "./useForest";
import { useMemo } from "react";

const useNode = (nodeKey?: PublicKey) => {
  const { nodes, fetchNode } = useForest();
  const node = useMemo(() => {
    console.log("memo node", nodeKey);

    if (!nodeKey) return;

    const n = nodes[nodeKey.toString()];
    if (!n) fetchNode(nodeKey);
    else return n;
  }, [nodeKey, nodes]);

  return node;
};

export default useNode;
