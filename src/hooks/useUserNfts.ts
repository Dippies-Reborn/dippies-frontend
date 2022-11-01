import { UserNftsContext } from "../contexts/UserNfts";
import { useContext } from "react";

export default function useUserNfts() {
  return useContext(UserNftsContext);
}
