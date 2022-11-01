import { Metadata, Metaplex, Nft } from "@metaplex-foundation/js";
import { NEW_DIPPIES_MINT, OG_DIPPIES_MINT } from "../utils/ids";
import React, { useEffect, useState } from "react";

import useProvider from "../hooks/useProvider";

interface UserNftsContextProps {
  tokens?: Nft[];
  entangledTokens?: Nft[];
  isFetching: boolean;
  fetchTokens: () => Promise<void>;
}
export const UserNftsContext = React.createContext<UserNftsContextProps>({
  tokens: [],
  entangledTokens: [],
  isFetching: false,
  fetchTokens: () => new Promise(() => {}),
});

export const UserNftsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const provider = useProvider();
  const [tokens, setTokens] = useState<Nft[]>();
  const [entangledTokens, setEntangledTokens] = useState<Nft[]>();
  const [isFetching, setIsFetching] = useState(false);

  const fetchTokens = async () => {
    if (!provider) return;
    setIsFetching(true);
    try {
      const metaplex = new Metaplex(provider.connection);
      const accounts = await metaplex
        .nfts()
        .findAllByOwner({ owner: provider.publicKey });

      const metadatas = await Promise.all(
        accounts
          .filter(
            (e) =>
              e.model === "metadata" &&
              (e.collection?.address.equals(OG_DIPPIES_MINT) ||
                e.collection?.address.equals(NEW_DIPPIES_MINT))
          )
          .map((e) => metaplex.nfts().load({ metadata: e as Metadata }))
      );
      console.log(metadatas);

      setTokens(
        metadatas.filter((e) =>
          e.collection?.address.equals(OG_DIPPIES_MINT)
        ) as any
      );
      setEntangledTokens(
        metadatas.filter((e) =>
          e.collection?.address.equals(NEW_DIPPIES_MINT)
        ) as any
      );
    } catch (err) {
      console.log("Failed to fetch user NFTs:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!tokens) {
      fetchTokens();
    }
  }, [provider]);

  return (
    <UserNftsContext.Provider
      value={{ tokens, entangledTokens, isFetching, fetchTokens }}
    >
      {children}
    </UserNftsContext.Provider>
  );
};
