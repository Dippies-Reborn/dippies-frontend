import { FaArrowAltCircleRight, FaRegLightbulb } from "react-icons/fa";

import Head from "next/head";
import Link from "next/link";
import { MdReportProblem } from "react-icons/md";
import type { NextPage } from "next";

const DIPHome: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dippies Club - Dippies Index Protocol</title>
        <meta name="description" content="A path forward" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col gap-10 mt-24">
        <div className="flex flex-col gap-3 bg-base-300 p-5 rounded-2xl shadow-2xl max-w-md mx-auto text-center">
          <div className="text-3xl font-bold">Dippies Index Protocol</div>
          <div className="">
            A hierarchical token-curated registry built on Solana
          </div>
          <div className="text-sm">
            Dippies Index Protocol (DIP) is a tool for projects to get market
            exposure, for supporters to show the world their favorite project
            and for beginners to be guided toward the best projects and teams.
          </div>
          <Link href={"/dip/trees"}>
            <div className="btn btn-primary btn-large w-full">
              View the forest
            </div>
          </Link>
        </div>
        <div className="flex flex-col gap-9 bg-base-100 p-5 m-2 rounded-2xl shadow-2xl max-w-md mx-auto text-center">
          <div className="flex flex-col">
            <div className="divider text-3xl font-bold">Why DIP ?</div>
            <div className="">
              <ul className="text-start flex flex-col gap-4">
                <li className="flex flex-row gap-2">
                  <MdReportProblem className="my-auto w-4 h-4" />
                  <div>Hard to keep up with projects on social media</div>
                </li>
                <li className="flex flex-row gap-2">
                  <MdReportProblem className="my-auto w-4 h-4" />
                  <div>Outdated links scattered around</div>
                </li>
                <li className="flex flex-row gap-2">
                  <MdReportProblem className="my-auto w-4 h-4" />
                  <div>Finding new reliable projects</div>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="divider text-3xl font-bold">
              How does it solve it ?
            </div>
            <div className="">
              <ul className="text-start flex flex-col gap-4">
                <li className="flex flex-row gap-2">
                  <FaRegLightbulb className="my-auto w-4 h-4" />
                  <div>
                    Immutable notes refering to a project are rated by users
                  </div>
                </li>
                <li className="flex flex-row gap-2">
                  <FaRegLightbulb className="my-auto w-4 h-4" />
                  <div>Token holders can stake on a note</div>
                </li>
                <li className="flex flex-row gap-2">
                  <FaRegLightbulb className="my-auto w-4 h-4" />
                  <div>
                    Stakers can be brided proportionally to the time and time
                    staked
                  </div>
                </li>
                <li className="flex flex-row gap-2">
                  <FaRegLightbulb className="my-auto w-4 h-4" />
                  <div>Anybody can create notes and grow trees</div>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="divider text-3xl font-bold">What is DIP ?</div>
            <div className="">
              <ul className="text-start">
                <li className="flex flex-row gap-2">
                  <FaArrowAltCircleRight className="my-auto w-4 h-4" />
                  <div>DIP is a forest of trees.</div>
                </li>
                <li className="flex flex-row gap-2">
                  <FaArrowAltCircleRight className="my-auto w-4 h-4" />
                  <div>
                    Trees are made of nodes, starting from the root, and each
                    node has child nodes, up to a certain height
                  </div>
                </li>
                <li className="flex flex-row gap-2">
                  <FaArrowAltCircleRight className="my-auto w-4 h-4" />
                  <div>
                    Each node has a set of tag. Children inherit all the tags of
                    their parent and have their own tag. Sibling nodes (with the
                    same parent) can't have the same tag.
                  </div>
                </li>
                <li className="flex flex-row gap-2">
                  <FaArrowAltCircleRight className="my-auto w-4 h-4" />
                  <div>Users create notes on nodes.</div>
                </li>
                <li className="flex flex-row gap-2">
                  <FaArrowAltCircleRight className="my-auto w-4 h-4" />
                  <div>
                    Users can stake on notes. Notes that have the highest stake
                    can move to nodes closer to the root to gain exposure.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DIPHome;
