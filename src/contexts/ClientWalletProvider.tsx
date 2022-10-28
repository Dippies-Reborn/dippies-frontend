import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletProvider } from "@solana/wallet-adapter-react";
import type { WalletProviderProps } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

import("@solana/wallet-adapter-react-ui/styles.css" as any);

export function ClientWalletProvider(
  props: Omit<WalletProviderProps, "wallets">
): JSX.Element {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolletWalletAdapter(),
    ],
    []
  );

  return (
    <WalletProvider wallets={wallets} {...props}>
      <WalletModalProvider {...props} />
    </WalletProvider>
  );
}

export default ClientWalletProvider;
