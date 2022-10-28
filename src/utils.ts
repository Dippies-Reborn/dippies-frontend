import { PublicKey } from "@solana/web3.js";

export const shortAddress = (key: PublicKey) => {
  const fullKey = key.toString();
  return (
    fullKey.substring(0, 4) +
    "..." +
    fullKey.substring(fullKey.length - 4, fullKey.length)
  );
};
