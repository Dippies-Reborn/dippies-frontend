import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { request } from "https";

export const shortAddress = (key: PublicKey) => {
  const fullKey = key.toString();
  return (
    fullKey.substring(0, 4) +
    "..." +
    fullKey.substring(fullKey.length - 4, fullKey.length)
  );
};

export const formatBn = (n: BN) => {
  return n.toNumber();
};

/**
 *
 * @param file - File object
 * @returns attachment or null
 */
export const uploadFileToIPFS = async (file: File) => {
  try {
    const res = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
      headers: { "": "" },
      method: "POST",
    });
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};
