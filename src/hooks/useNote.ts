import { PublicKey } from "@solana/web3.js";
import useForest from "./useForest";
import { useMemo } from "react";

const useNote = (noteKey?: PublicKey) => {
  const { notes, fetchNote } = useForest();
  const note = useMemo(() => {
    console.log("memo note", noteKey?.toString());

    if (!noteKey) return;

    const n = notes[noteKey.toString()];
    console.log(n);

    if (!n) fetchNote(noteKey);
    else return n;
  }, [noteKey, notes]);

  return note;
};

export default useNote;
