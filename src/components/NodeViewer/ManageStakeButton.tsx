import { DIPPIES_FOREST, DIPPIES_TOKEN } from "../../utils/ids";
import {
  Note,
  getCreateStakeAccounts,
  getNoteAddress,
} from "../../programs/dippiesIndexProtocol";
import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { BN } from "bn.js";
import Decimal from "decimal.js";
import { DecimalUtil } from "@orca-so/sdk";
import { GiTwoCoins } from "react-icons/gi";
import { TokenInfo } from "../TokenInfo";
import { Transaction } from "@solana/web3.js";
import { formatBn } from "../../utils";
import toast from "react-hot-toast";
import useForest from "../../hooks/useForest";
import useProvider from "../../hooks/useProvider";
import useStake from "../../hooks/useStake";
import useToken from "../../hooks/useToken";
import useTokenAccount from "../../hooks/useTokenAccount";

export default ({ note, onUpdate }: { note: Note; onUpdate?: () => {} }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const provider = useProvider();
  const { account, refresh } = useTokenAccount(DIPPIES_TOKEN);
  const { program, forest } = useForest();
  const { token } = useToken(forest?.voteMint);
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number>();
  const stake = useStake(
    wallet.publicKey ? getNoteAddress(note.tree, note.id) : undefined
  );

  const updateStake = async (add: boolean) => {
    if (!provider || !wallet.publicKey || !program || !forest || !amount)
      return;

    const tx = new Transaction();

    if (!stake) {
      tx.add(
        await program.methods
          .createStake()
          .accounts(
            getCreateStakeAccounts(
              DIPPIES_FOREST,
              forest.voteMint,
              note.tree,
              note.parent,
              getNoteAddress(note.tree, note.id),
              wallet.publicKey
            )!
          )
          .instruction()
      );
    }

    const finalAmount = add
      ? new BN(
          DecimalUtil.toU64(new Decimal(amount), token.decimals).toString()
        )
      : new BN(
          DecimalUtil.toU64(new Decimal(amount), token.decimals).toString()
        ).neg();
    tx.add(
      await program.methods
        .updateStake(finalAmount)
        .accounts(
          getCreateStakeAccounts(
            DIPPIES_FOREST,
            forest.voteMint,
            note.tree,
            note.parent,
            getNoteAddress(note.tree, note.id),
            wallet.publicKey
          )!
        )
        .instruction()
    );

    try {
      await connection.confirmTransaction(
        await wallet.sendTransaction(tx, connection, { skipPreflight: true })
      );
      refresh();
      setIsOpen(false);
      setAmount(undefined);
      onUpdate && onUpdate();
    } catch (e) {
      toast.error(`Failed udating stake: ${e}`);
    }
  };

  console.log(stake, account, amount);

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
              <div>
                {forest && stake ? (
                  <TokenInfo mint={forest?.voteMint} amount={account?.amount} />
                ) : (
                  "???"
                )}
              </div>
            </div>
            <div className="my-auto text-lg flex flex-row justify-between">
              <div>Your stake:</div>
              <div onClick={() => setAmount(stake ? formatBn(stake.stake) : 0)}>
                {forest && stake ? (
                  <TokenInfo mint={forest?.voteMint} amount={stake?.stake} />
                ) : (
                  "???"
                )}
              </div>
            </div>
            <div className="my-auto text-lg flex flex-row justify-between">
              <div>Total stake:</div>
              <div>
                {forest && stake ? (
                  <TokenInfo mint={forest?.voteMint} amount={note?.stake} />
                ) : (
                  "???"
                )}
              </div>
            </div>
            <div className="flex flex-row gap-3 justify-center">
              <input
                className="input w-full"
                type="number"
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <div
                className={`btn btn-error btn-outline text-4xl ${
                  !stake || formatBn(stake.stake) <= 0 ? "btn-disabled" : ""
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
