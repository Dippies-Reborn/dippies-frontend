import { PublicKey } from "@solana/web3.js";
import { useEffect } from "react";
import useForest from "./useForest";
import { useMemo } from "react";

const useTree = (treeKey?: PublicKey) => {
  const { trees, fetchTree } = useForest();
  const tree = useMemo(() => {
    if (!treeKey) return;

    return trees[treeKey.toString()];
  }, [trees]);

  useEffect(() => {
    if (!tree && treeKey) {
      fetchTree(treeKey);
    }
  }, [trees]);

  return tree;
};

export default useTree;
