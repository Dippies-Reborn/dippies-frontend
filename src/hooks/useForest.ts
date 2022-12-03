import { DipForestContext } from "./../contexts/DipForest";
import { useContext } from "react";

export default function useForest() {
  return useContext(DipForestContext);
}
