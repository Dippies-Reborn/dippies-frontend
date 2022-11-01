import * as anchor from "@project-serum/anchor";

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

export default function useProvider() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  return wallet ? new anchor.AnchorProvider(connection, wallet, {}) : undefined;
}
