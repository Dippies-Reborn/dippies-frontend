import CollectionCard from "./CollectionCard";
import React from "react";
import useRegisteredCollections from "../../hooks/useRegisteredCollections";

export default () => {
  const { collections, isFetching } = useRegisteredCollections();

  console.log("Collections", collections);
  return (
    <div className="m-5 p-5">
      {collections && collections.length > 0 ? (
        <>
          <div className="text-2xl font-bold">Registered collections</div>
          <div className="flex flex-wrap">
            {collections.map((e) => (
              <CollectionCard collection={e} />
            ))}
          </div>
        </>
      ) : (
        <>
          {isFetching ? (
            <div className="text-center text-3xl p-5">
              <span>Fetching collections...</span>
              <progress className="progress"></progress>
            </div>
          ) : (
            <div>There are no registered collections yet...</div>
          )}
        </>
      )}
    </div>
  );
};
