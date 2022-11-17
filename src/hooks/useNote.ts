import * as anchor from "@project-serum/anchor";

import { Node, Note, StakeAccount } from "../programs/dippiesIndexProtocol";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

import { NodeWithKey } from "./useTree";
import { PublicKey } from "@solana/web3.js";
import { TreeDeaStakeAccount } from "./../programs/dippiesIndexProtocol/stakeAccount";

export interface NoteWithKey extends Note {
  key: PublicKey;
}

export interface StakeAccountWithKey extends StakeAccount {
  key: PublicKey;
}

export default function useNote(note: NoteWithKey) {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [userStake, setUserStake] = useState<StakeAccountWithKey>();

  const fetchUserStake = async () => {
    if (!connection || !wallet?.publicKey) return;

    const stakeKey = TreeDeaStakeAccount.key(note.key, wallet.publicKey);
    const res = await StakeAccount.fetch(connection, stakeKey);
    console.log(res);

    if (res) {
      setUserStake({ ...res, key: stakeKey } as any);
    }
  };
  useEffect(() => {
    if (!note) fetchUserStake();
  }, [wallet?.publicKey, note]);

  return { userStake, fetchUserStake };
}
