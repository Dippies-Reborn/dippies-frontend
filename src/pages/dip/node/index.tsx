import Head from "next/head";
import type { NextPage } from "next";
import NodeViewer from "../../../components/NodeViewer";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { useRouter } from "next/router";

const TreePage: NextPage = () => {
  const router = useRouter();
  const { key } = router.query;
  const pubkey = useMemo(() => {
    if (!key && typeof key !== "string") return;
    try {
      return new PublicKey(key);
    } catch {}
  }, [router]);

  console.log(router);

  return (
    <>
      <Head>
        <title>Dippies Club - Dippies Index Protocol</title>
        <meta name="description" content="A path forward" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {pubkey ? <NodeViewer nodeKey={pubkey} /> : null}
    </>
  );
};

export default TreePage;
