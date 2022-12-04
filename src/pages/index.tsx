import { Entangler } from "../components/Entangler/Entangler";
import Head from "next/head";
import Hero from "../components/Hero/Hero";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dippies Club</title>
        <meta name="description" content="A path forward" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute top-0 -z-10 h-screen w-full">
        <Hero heading="Dippies Club" message="Dippies to the nippies" />
      </div>
    </>
  );
};

export default Home;
