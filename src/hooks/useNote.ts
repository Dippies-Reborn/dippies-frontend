import * as anchor from "@project-serum/anchor";

import { Node, Note } from "../programs/dippiesIndexProtocol/accounts";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

import { NodeWithKey } from "./useTree";
import { PublicKey } from "@solana/web3.js";

export interface NoteWithKey extends Note {
  key: PublicKey;
}

export default function useNote(noteKey: anchor.web3.PublicKey) {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [note, setNote] = useState<NoteWithKey>();

  const fetchNote = async () => {
    if (!connection || !wallet?.publicKey) return;

    const res = await Note.fetch(connection, noteKey);

    if (res) setNote({ ...res, key: noteKey } as any);
  };
  useEffect(() => {
    if (!note) fetchNote();
  }, [wallet?.publicKey, note]);

  return { note };
}
