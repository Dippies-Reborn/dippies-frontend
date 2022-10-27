import Contact from "../components/Contact/Contact";
import Head from "next/head";
import Hero from "../components/Hero/Hero";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dippies Reborn</title>
        <meta
          name="description"
          content="A path forward"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero heading="Dippies Reborn" message="Dippies to the nippies" />
      <Contact />
    </>
  );
};

export default Home;
