import "../styles/globals.css";

import type { AppProps } from "next/app";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import NavBar from "../components/NavigationBar/NavBar";
import { RegisteredCollectionsProvider } from "../contexts/RegisteredCollection";
import { Toaster } from "react-hot-toast";
import { UserNftsProvider } from "../contexts/UserNfts";
import dynamic from "next/dynamic";

const endpoint = "https://api.devnet.solana.com";
// "https://rpc.helius.xyz/?api-key=d1593552-6d2e-4ef5-b897-856c3d96c316";

const WalletProvider = dynamic(
  () => import("../contexts/ClientWalletProvider"),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider>
        <UserNftsProvider>
          <RegisteredCollectionsProvider>
            <NavBar />
            <Component {...pageProps} />
            <Toaster />
          </RegisteredCollectionsProvider>
        </UserNftsProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
