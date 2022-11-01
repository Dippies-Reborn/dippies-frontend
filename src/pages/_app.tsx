import "../styles/globals.css";

import type { AppProps } from "next/app";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import NavBar from "../components/NavigationBar/NavBar";
import { UserNftsProvider } from "../contexts/UserNfts";
import dynamic from "next/dynamic";

const endpoint =
  "https://solana-mainnet.g.alchemy.com/v2/-Rlnd-xRdEeZJyZZ2APT7J6-VVCvsx2E";

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
          <NavBar />
          <Component {...pageProps} />
        </UserNftsProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
