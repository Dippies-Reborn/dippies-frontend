import { RegisteredCollectionsContext } from "./../contexts/RegisteredCollection";
import { useContext } from "react";

export default function useRegisteredCollections() {
  return useContext(RegisteredCollectionsContext);
}
