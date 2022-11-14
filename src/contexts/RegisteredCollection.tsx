import * as anchor from "@project-serum/anchor";

import { Metadata, Metaplex, Nft } from "@metaplex-foundation/js";
import { NEW_DIPPIES_MINT, OG_DIPPIES_MINT } from "../utils/ids";
import React, { useEffect, useState } from "react";

import { CollectionEntry } from "../programs/entangler";
import { PROGRAM_ID as ENTANGLER_PROGRAM_ID } from "./../programs/entangler/programId";
import { EntangledCollection } from "../programs/entangler";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import useProvider from "../hooks/useProvider";

export interface RegisteredCollection extends Metadata {
  key: string;
  id: PublicKey;
}

interface RegisteredCollectionsContextProps {
  collections?: RegisteredCollection[];
  isFetching: boolean;
}
export const RegisteredCollectionsContext =
  React.createContext<RegisteredCollectionsContextProps>({
    collections: [],
    isFetching: false,
  });

export const RegisteredCollectionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { connection } = useConnection();
  const [collections, setCollections] = useState<RegisteredCollection[]>();
  const [isFetching, setIsFetching] = useState(false);

  const fetchCollections = async () => {
    if (!connection) return;

    setIsFetching(true);

    const metaplex = new Metaplex(connection);

    const registered = (
      await connection.getProgramAccounts(ENTANGLER_PROGRAM_ID, {
        filters: [
          {
            memcmp: {
              bytes: anchor.utils.bytes.bs58.encode(
                CollectionEntry.discriminator
              ),
              offset: 0,
            },
          },
        ],
      })
    )
      .map((e) => {
        try {
          return CollectionEntry.decode(e.account.data);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const collections = (
      await connection.getProgramAccounts(ENTANGLER_PROGRAM_ID, {
        filters: [
          {
            memcmp: {
              bytes: anchor.utils.bytes.bs58.encode(
                EntangledCollection.discriminator
              ),
              offset: 0,
            },
          },
        ],
      })
    )
      .map((e) => {
        try {
          return EntangledCollection.decode(e.account.data);
        } catch {
          return null;
        }
      })
      .filter((e) =>
        registered.map((f) => f?.id.toString()).includes(e?.id.toString())
      )
      .map((e) => {
        const item = registered.find(
          (f) => e?.id.toString() === f?.id.toString()
        )!;
        return {
          ...e,
          key: item.key,
          id: item.id,
        };
      });

    const metadata = await Promise.all(
      collections.map(async (e) => ({
        ...(await metaplex.nfts().findByMint({
          mintAddress: e!.entangledCollectionMint!,
        })),
        key: e.key,
        id: e.id,
      }))
    );

    setCollections(metadata as any);

    setIsFetching(false);
  };

  useEffect(() => {
    fetchCollections();
  }, [connection]);

  return (
    <RegisteredCollectionsContext.Provider
      value={{
        collections,
        isFetching,
      }}
    >
      {children}
    </RegisteredCollectionsContext.Provider>
  );
};
