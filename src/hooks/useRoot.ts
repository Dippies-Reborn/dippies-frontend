import * as anchor from "@project-serum/anchor";

import { DIPPIES_ROOT, DIPPIES_TOKEN } from "./../utils/ids";
import { Root, Tree } from "../programs/dippiesIndexProtocol/accounts";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

import { PROGRAM_ID as DIP_PROGRAM_ID } from "./../programs/dippiesIndexProtocol/programId";
import { PublicKey } from "@solana/web3.js";
import { TreeDeaRoot } from "./../programs/dippiesIndexProtocol/root";

export interface RootWithKey extends Root {
  key: PublicKey;
}
export interface TreeWithKey extends Tree {
  key: PublicKey;
}

export default function useRoot() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [root, setRoot] = useState<RootWithKey>();
  const [trees, setTrees] = useState<TreeWithKey[]>();

  const fetchRoot = async () => {
    if (!connection || !wallet?.publicKey) return;

    const r = new TreeDeaRoot(wallet.publicKey, DIPPIES_ROOT, DIPPIES_TOKEN);
    const res = await Root.fetch(connection, r.rootKey);
    if (res) setRoot({ ...res, key: r.rootKey } as any);
  };
  useEffect(() => {
    if (!root) fetchRoot();
  }, [wallet?.publicKey]);

  const fetchTrees = async () => {
    if (!connection || !wallet?.publicKey) return;

    const r = new TreeDeaRoot(wallet.publicKey, DIPPIES_ROOT, DIPPIES_TOKEN);
    const accounts = await connection.getProgramAccounts(DIP_PROGRAM_ID, {
      filters: [
        {
          memcmp: {
            bytes: anchor.utils.bytes.bs58.encode(Tree.discriminator),
            offset: 0,
          },
        },
        {
          memcmp: {
            bytes: r.rootKey.toBase58(),
            offset: 8,
          },
        },
      ],
    });

    setTrees(
      accounts.map(
        (e) => ({ ...Tree.decode(e.account.data), key: e.pubkey } as any)
      )
    );
  };
  useEffect(() => {
    if (!trees) fetchTrees();
  }, [wallet?.publicKey]);

  return { root, trees, fetchTrees };
}
