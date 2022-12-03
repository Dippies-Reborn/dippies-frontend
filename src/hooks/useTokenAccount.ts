import {
  Account,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

import { Note } from "../programs/dippiesIndexProtocol";
import { PublicKey } from "@solana/web3.js";
import useToken from "./useToken";

export interface NoteWithKey extends Note {
  key: PublicKey;
}

export default function useTokenAccount(mint: PublicKey) {
  const wallet = useAnchorWallet();
  const { token } = useToken(mint);
  const { connection } = useConnection();
  const [userAccount, setUserAccount] = useState<Account>();
  const value =
    userAccount && token
      ? userAccount.amount.toLocaleString("fullwide", {
          maximumFractionDigits: token.decimals as any,
        })
      : 0;

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

  return {
    account: userAccount,
    refresh: fetchUserAccount,
    value,
  };
}
