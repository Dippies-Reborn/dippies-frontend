import { FaCrown } from "react-icons/fa";
import Link from "next/link";
import React from "react";
import { RegisteredCollection } from "../../contexts/RegisteredCollection";
import verifiedCollection from "../../constants/verified_collections.json";

export default ({ collection }: { collection: RegisteredCollection }) => {
  console.log("Collection", collection);
  return (
    <Link href={"/collection?id=" + collection.key}>
      <div
        key={collection.address.toString()}
        className={`m-2 static flex flex-col w-32 sm:w-48 rounded-lg shadow-xl bg-neutral`}
      >
        {verifiedCollection.includes(collection.address.toString()) ? (
          <div className="tooltip" data-tip={"Verified collection"}>
            <FaCrown className="absolute w-6 h-6 m-1 text-neutral-focus" />
          </div>
        ) : null}
        <img className="w-56 rounded-t-md" src={collection.json?.image} />
        <span className="text-xl font-bold text-center p-3 text-neutral-content">
          {collection.name}
        </span>
      </div>
    </Link>
  );
};
