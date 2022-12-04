import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import { useWallet } from "@solana/wallet-adapter-react";

type Networks = "Mainnet" | "Devnet" | "Localnet";
interface Network {
  endpoint: string;
  name: Networks;
  slug: string;
}

// "https://solana-mainnet.g.alchemy.com/v2/adDYOBvkCEV1a8d5MhmFgxd5tR5KLqq6";
// "https://solana-mainnet.g.alchemy.com/v2/-Rlnd-xRdEeZJyZZ2APT7J6-VVCvsx2E";
// "https://rpc.helius.xyz/?api-key=a1036f99-541a-45f6-a650-d5aa465e9a10";

const networks: Network[] = [
  {
    endpoint:
      "https://solana-mainnet.g.alchemy.com/v2/iAi3pvCx6buRGu6rtRQV5MhCzKQ74qI1",
    name: "Mainnet",
    slug: "mainnet-beta",
  },
  {
    endpoint: "https://api.devnet.solana.com",
    name: "Devnet",
    slug: "devnet",
  },
  { endpoint: "http://localhost:8899", name: "Localnet", slug: "mainnet-beta" },
];

export default function useNetwork() {
  const [network, setNetwork] = useLocalStorage(`dippies_network`, networks[0]);
  const wallet = useWallet();

  const changeNetwork = (networkName: Networks) => {
    setNetwork(networks.find((e) => e.name === networkName) || networks[0]);
  };

  useEffect(() => {
    console.log("");
    if (wallet.connected) {
      wallet.connect();
    }
  }, [network]);

  return { ...network, changeNetwork, networks };
}
