import "../styles/globals.css";

import type { AppProps } from "next/app";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { DipForestProvider } from "../contexts/DipForest";
import NavBar from "../components/NavigationBar/NavBar";
import { RegisteredCollectionsProvider } from "../contexts/RegisteredCollection";
import { Toaster } from "react-hot-toast";
import { TokensProvider } from "../contexts/Tokens";
import { UserNftsProvider } from "../contexts/UserNfts";
import dynamic from "next/dynamic";
import useNetwork from "../hooks/useNetwork";

const WalletProvider = dynamic(
  () => import("../contexts/ClientWalletProvider"),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  const { endpoint } = useNetwork();
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider>
        <TokensProvider>
          <UserNftsProvider>
            <RegisteredCollectionsProvider>
              <DipForestProvider>
                <NavBar />
                <Component {...pageProps} />
                <Toaster />
              </DipForestProvider>
            </RegisteredCollectionsProvider>
          </UserNftsProvider>
        </TokensProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
