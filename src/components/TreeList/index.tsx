import Link from "next/link";
import React from "react";
import { TokenInfo } from "../TokenInfo";
import useForest from "../../hooks/useForest";

export default () => {
  const { forest, trees } = useForest();

  return trees ? (
    <div className="flex flex-col w-lg justify-center">
      <div className="divider text-2xl font-bold p-5 ">All trees</div>
      <div className="flex flex-wrap mx-auto justify-center">
        {Object.values(trees).map((tree) => (
          <Link key={tree.title} href={`/dip/node/${tree.rootNode.toString()}`}>
            <div className="bg-base-200 shadow-xl rounded-xl p-5 m-3">
              <div className="text-lg font-bold">{tree.title}</div>
              <div>
                Total stake:{" "}
                {forest ? (
                  <TokenInfo mint={forest.voteMint} amount={tree.stake} />
                ) : (
                  "???"
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  ) : (
    <div>
      <progress className="progress"></progress>
    </div>
  );
};
