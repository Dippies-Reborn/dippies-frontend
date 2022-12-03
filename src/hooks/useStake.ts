import { StakeState, getStakeAddress } from "../programs/dippiesIndexProtocol";
import { useEffect, useState } from "react";

import { PublicKey } from "@solana/web3.js";
import useForest from "./useForest";

const useStake = (noteKey?: PublicKey) => {
  const { program, stakes, fetchStake } = useForest();
  const [stake, setStake] = useState<StakeState>();

  const getStake = () => {
    if (!program || !program.provider.publicKey || !noteKey) return;

    const stakeKey = getStakeAddress(noteKey, program.provider.publicKey);
    const s = stakes[stakeKey.toString()];

    if (!s) {
      fetchStake(stakeKey);
    } else {
      setStake(s);
    }
  };

  useEffect(() => {
    getStake();
  }, [stakes, noteKey]);

  return stake;
};

export default useStake;
