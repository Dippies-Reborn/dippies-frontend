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
      <TreeList />
      <div className="w-fit m-10 mx-auto p-3 bg-base-200 rounded-xl">
        <div className="text-xl">Can't find the topic you're looking for?</div>
        <TreeCreator />
      </div>
    </>
  );
};

export default DIPHome;
