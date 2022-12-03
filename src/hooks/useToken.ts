import { Mint, getMint } from "@solana/spl-token";
import { useEffect, useState } from "react";

import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";

export default function useToken(mint?: PublicKey) {
  const { connection } = useConnection();
  const [token, setToken] = useState<Mint>();

  const fetchToken = async () => {
    if (!connection) return;

    try {
      const account = await getMint(connection, mint);
      setToken(account);
    } catch {}
  };
  useEffect(() => {
    fetchToken();
  }, [mint]);

  return {
    token,
  };
}
