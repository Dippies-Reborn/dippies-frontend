import Head from "next/head";
import type { NextPage } from "next";
import TreeCreator from "../../components/TreeCreator";
import TreeList from "../../components/TreeList";

const DIPHome: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dippies Club - Dippies Index Protocol</title>
        <meta name="description" content="A path forward" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-24">
        <TreeCreator />
        <TreeList />
      </div>
    </>
  );
};

export default DIPHome;
