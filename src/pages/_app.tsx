import "../styles/globals.css";

import type { AppProps } from "next/app";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { DipForestProvider } from "../contexts/DipForest";
import NavBar from "../components/NavigationBar/NavBar";
import { RegisteredCollectionsProvider } from "../contexts/RegisteredCollection";
import { Toaster } from "react-hot-toast";
import { UserNftsProvider } from "../contexts/UserNfts";
import dynamic from "next/dynamic";

const endpoint = "https://api.devnet.solana.com";
// "https://solana-mainnet.g.alchemy.com/v2/adDYOBvkCEV1a8d5MhmFgxd5tR5KLqq6";
// "https://solana-mainnet.g.alchemy.com/v2/-Rlnd-xRdEeZJyZZ2APT7J6-VVCvsx2E";
// "https://rpc.helius.xyz/?api-key=a1036f99-541a-45f6-a650-d5aa465e9a10";

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
            <DipForestProvider>
              <NavBar />
              <Component {...pageProps} />
              <Toaster />
            </DipForestProvider>
          </RegisteredCollectionsProvider>
        </UserNftsProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
