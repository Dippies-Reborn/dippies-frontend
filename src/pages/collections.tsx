import CollectionCreator from "../components/CollectionCreator";
import CollectionList from "../components/CollectionList";
import Head from "next/head";
import type { NextPage } from "next";

const Collections: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dippies Club - Collections</title>
        <meta name="description" content="A path forward" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-5">
        <CollectionList />
        <CollectionCreator />
      </div>
    </>
  );
};

export default Collections;
