import { Entangler } from "../components/Entangler/Entangler";
import Head from "next/head";
import Hero from "../components/Hero/Hero";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dippies Club - Entangle</title>
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

export default Home;
