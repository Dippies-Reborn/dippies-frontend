import React, { useState } from "react";
import {
  StakeAccount,
  TreeDeaStakeAccount,
} from "../../programs/dippiesIndexProtocol";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import useNote, { NoteWithKey, StakeAccountWithKey } from "../../hooks/useNote";

import { BN } from "bn.js";
import { DIPPIES_TOKEN } from "../../utils/ids";
import { FaExternalLinkAlt } from "react-icons/fa";
import { GiTwoCoins } from "react-icons/gi";
import Image from "next/image";
import Link from "next/link";
import { Transaction } from "@solana/web3.js";
import { formatBn } from "../../utils";
import useProvider from "../../hooks/useProvider";
import useTokenAccount from "../../hooks/useTokenAccount";

export default ({
  note,
  onUpdate,
}: {
  note: NoteWithKey;
  onUpdate?: () => {};
}) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const provider = useProvider();
  const { account, refresh } = useTokenAccount(DIPPIES_TOKEN);
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number>();
  const { userStake, fetchUserStake } = useNote(note);

  const updateStake = async (add: boolean) => {
    if (!provider || !wallet.publicKey || !amount) return;
    const stake = await TreeDeaStakeAccount.fromNote(provider, note);

    const tx = new Transaction();

    if (!stake) {
      return;
    }

    if (!(await StakeAccount.fetch(connection, stake.stakeAccount))) {
      tx.add(stake.instruction.createStake());
    }

    const finalAmount = add ? new BN(amount) : new BN(amount).neg();
    tx.add(stake.instruction.updateStake(finalAmount));

    await connection.confirmTransaction(
      await wallet.sendTransaction(tx, connection, { skipPreflight: true })
    );

    refresh();
    fetchUserStake();
    setIsOpen(false);
    setAmount(undefined);
    onUpdate && onUpdate();
  };

  console.log(userStake, account);

  return (
    <>
      <div
        className="btn w-full justify-around"
        onClick={() => setIsOpen(true)}
      >
        <div>Manage stake</div>
        <GiTwoCoins />
      </div>
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box flex flex-col gap-5">
          <div
            className="btn btn-sm btn-circle fixed right-2 top-2 absolute"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </div>
          <div className="text-2xl font-bold">Manage stake</div>
          <div className="flex flex-col gap-3 justify-between bg-base-200 shadow-inner rounded-lg p-3">
            <div className="my-auto text-lg flex flex-row justify-between">
              <div>Your balance:</div>
              <div>{account?.amount.toString() || 0}</div>
            </div>
            <div className="my-auto text-lg flex flex-row justify-between">
              <div>Your stake:</div>
              <div
                onClick={() =>
                  setAmount(userStake ? formatBn(userStake.stake) : 0)
                }
              >
                {userStake?.stake.toString() || 0}
              </div>
            </div>
            <div className="my-auto text-lg flex flex-row justify-between">
              <div>Total stake:</div>
              <div>{note.stake.toString() || 0}</div>
            </div>
            <div className="flex flex-row gap-3 justify-center">
              <input
                className="input w-full"
                type="number"
                onChange={(e) => setAmount(Number(e.target.value))}
                value={amount}
              />
              <div
                className={`btn btn-error btn-outline text-4xl ${
                  !userStake || formatBn(userStake.stake) <= 0
                    ? "btn-disabled"
                    : ""
                }`}
                onClick={() => updateStake(false)}
              >
                -
              </div>
              <div
                className={`btn btn-success btn-outline text-4xl ${
                  !amount || !account || formatBn(account.amount.toString()) < 0
                    ? "btn-disabled"
                    : ""
                }`}
                onClick={() => updateStake(true)}
              >
                +
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
