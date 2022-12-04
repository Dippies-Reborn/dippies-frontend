import { useEffect, useMemo } from "react";

import { Entangler } from "../../components/Entangler/Entangler";
import { EntanglerWrapper } from "../../programs/entangler";
import Head from "next/head";
import type { NextPage } from "next";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import useRegisteredCollections from "../../hooks/useRegisteredCollections";
import { useRouter } from "next/router";
import useUserNfts from "../../hooks/useUserNfts";

const Collection: NextPage = () => {
  const { connection } = useConnection();
  const router = useRouter();
  const { id } = router.query;
  const { setCollections } = useUserNfts();
  const { collections } = useRegisteredCollections();

  const entangledCollection = collections?.find((e) => e.key === id);

  useEffect(() => {
    if (entangledCollection) {
      (async () => {
        const c = await EntanglerWrapper.fetcher.entangledCollection(
          connection,
          entangledCollection.id
        );
        if (c) {
          setCollections(c.originalCollectionMint, c.entangledCollectionMint);
        }
      })();
    }
  }, [entangledCollection]);

  return (
    <>
      <Head>
        <title>
          Dippies Club -{" "}
          {entangledCollection ? entangledCollection.name : "Collection"}
        </title>
        <meta name="description" content="A path forward" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-24">
        <Entangler />
        <Entangler disentangle />
      </div>
    </>
  );
};

export default Collection;
