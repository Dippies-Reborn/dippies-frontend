import {
  Account,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

import { DIPPIES_TOKEN } from "./../utils/ids";
import { Note } from "../programs/dippiesIndexProtocol";
import { PublicKey } from "@solana/web3.js";

export interface NoteWithKey extends Note {
  key: PublicKey;
}

export default function useTokenAccount(mint: PublicKey) {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [userAccount, setUserAccount] = useState<Account>();

  const fetchUserAccount = async () => {
    if (!connection || !wallet?.publicKey) return;

    try {
      const account = await getAccount(
        connection,
        getAssociatedTokenAddressSync(mint, wallet.publicKey)
      );
      setUserAccount(account);
    } catch {}
  };
  useEffect(() => {
    fetchUserAccount();
  }, [wallet?.publicKey, mint]);

  return { account: userAccount, refresh: fetchUserAccount };
}
