import "../styles/globals.css";

import type { AppProps } from "next/app";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import NavBar from "../components/NavigationBar/NavBar";
import dynamic from "next/dynamic";

const endpoint = "https://explorer-api.devnet.solana.com";

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
        <NavBar />
        <Component {...pageProps} />
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
