import { Metadata, Metaplex, Nft } from "@metaplex-foundation/js";
import { NEW_DIPPIES_MINT, OG_DIPPIES_MINT } from "../utils/ids";
import React, { useEffect, useState } from "react";

import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import useProvider from "../hooks/useProvider";

interface UserNftsContextProps {
  tokens?: Nft[];
  entangledTokens?: Nft[];
  isFetching: boolean;
  fetchTokens: () => Promise<void>;
  setCollections: (original: PublicKey, entangled: PublicKey) => void;
}
export const UserNftsContext = React.createContext<UserNftsContextProps>({
  tokens: [],
  entangledTokens: [],
  isFetching: false,
  fetchTokens: () => new Promise(() => {}),
  setCollections: (original: PublicKey, entangled: PublicKey) => {},
});

export const UserNftsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const provider = useProvider();
  const [allTokens, setAllTokens] = useState<Nft[]>();
  const [tokens, setTokens] = useState<Nft[]>();
  const [entangledTokens, setEntangledTokens] = useState<Nft[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [addresses, setAddresses] = useState([
    OG_DIPPIES_MINT,
    NEW_DIPPIES_MINT,
  ]);

  const fetchAllTokens = async () => {
    if (!provider) return;
    setIsFetching(true);
    try {
      const metaplex = new Metaplex(provider.connection);
      const accounts = await metaplex
        .nfts()
        .findAllByOwner({ owner: provider.publicKey });

      setAllTokens(accounts.filter((e) => e.model === "metadata") as any);
    } catch (err) {
      console.log("Failed to fetch all user NFTs:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!allTokens) {
      fetchAllTokens();
    }
  }, [provider?.publicKey, allTokens]);

  const fetchTokens = async () => {
    if (!provider || !allTokens) return;
    setIsFetching(true);
    try {
      const metaplex = new Metaplex(provider.connection);

      const metadatas = allTokens.filter(
        (e) =>
          e !== null &&
          (e.collection?.address.equals(addresses[0]) ||
            e.collection?.address.equals(addresses[1]))
      );
      const loadedMetadata = await Promise.all(
        metadatas.map((e) => metaplex.nfts().load({ metadata: e as any }))
      );

      setTokens(
        loadedMetadata.filter((e) =>
          e.collection?.address.equals(addresses[0])
        ) as any
      );
      setEntangledTokens(
        loadedMetadata.filter((e) =>
          e.collection?.address.equals(addresses[1])
        ) as any
      );
    } catch (err) {
      console.log("Failed to fetch user NFTs:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!tokens && allTokens) {
      fetchTokens();
    }
  }, [provider?.publicKey, allTokens, tokens]);

  const setCollections = (original: PublicKey, entangled: PublicKey) => {
    setAddresses([original, entangled]);
  };

  return (
    <UserNftsContext.Provider
      value={{
        tokens,
        entangledTokens,
        isFetching,
        setCollections,
        fetchTokens,
      }}
    >
      {children}
    </UserNftsContext.Provider>
  );
};
