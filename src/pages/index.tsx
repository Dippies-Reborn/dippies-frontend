import Contact from "../components/Contact/Contact";
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
      <Hero heading="Dippies Club" message="Dippies to the nippies" />
      <Entangler />
      <Entangler disentangle />
      <Contact />
    </>
  );
};

export default Home;
