import { DIPPIES_DAO_KEY, DIPPIES_KEY, OG_DIPPIES_MINT } from "../../utils/ids";
import { FaCheckCircle, FaQuestionCircle } from "react-icons/fa";
import {
  getEntangledMint,
  getEntangledPair,
} from "../../programs/entangler/pda";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { EntangledPair } from "../../programs/entangler/accounts/EntangledPair";
import { EntanglerWrapper } from "../../programs/entangler";
import { Nft } from "@metaplex-foundation/js";
import PaperAirplaneIcon from "@heroicons/react/24/outline/PaperAirplaneIcon";
import React from "react";
import { Transaction } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";
import { toast } from "react-hot-toast";
import { useState } from "react";
import useUserNfts from "../../hooks/useUserNfts";

export const Entangler = ({ disentangle }: { disentangle?: boolean }) => {
  const { connection } = useConnection();
  const {
    tokens: originalTokens,
    entangledTokens,
    isFetching,
    entangled,
    disentangled,
  } = useUserNfts();
  const tokens = disentangle ? entangledTokens : originalTokens;
  const wallet = useWallet();

  const [isEntangling, setIsEntangling] = useState(false);
  const [burnOriginal, setBurnOriginal] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<Nft[]>([]);

  const handleEntangle = async () => {
    if (!wallet || selectedTokens.length == 0 || !connection) {
      return;
    }

    setIsEntangling(true);

    try {
      let txs = [];

      for (const token of selectedTokens) {
        const tx = new Transaction(await connection.getLatestBlockhash());
        const entangler = new EntanglerWrapper(
          OG_DIPPIES_MINT,
          wallet.publicKey!,
          DIPPIES_KEY,
          DIPPIES_DAO_KEY,
          500
        );

        const entangledMint = getEntangledMint(DIPPIES_KEY, token.address);

        if (!disentangle) {
          // Find the pair
          try {
            await getMint(connection, entangledMint);
          } catch (e) {
            tx.add(entangler.instruction.initializePair(token.address));
          }

          tx.add(entangler.instruction.entangle(token.address));

          if (burnOriginal) {
            tx.add(entangler.instruction.burnOriginal(token.mint.address));
          }
        } else {
          try {
            const entangledPairKey = getEntangledPair(entangledMint);
            const entangledPair = await EntangledPair.fetch(
              connection,
              entangledPairKey
            );
            tx.add(
              entangler.instruction.disentangle(entangledPair?.originalMint!)
            );
          } catch {
            toast.error(`Can't disentangle ${token.name}`);
          }
        }

        tx.feePayer = wallet.publicKey!;
        txs.push(tx);
      }

      txs = txs.filter((tx) => {
        console.log(tx.instructions);
        return tx.instructions.length > 0;
      });
      if (txs.length > 0) {
        const signed = await wallet.signAllTransactions!(txs);
        await Promise.all(
          signed.map(
            async (tx) =>
              await connection.confirmTransaction(
                await connection.sendRawTransaction(tx.serialize(), {
                  skipPreflight: true,
                })
              )
          )
        );
        disentangle ? disentangled(selectedTokens) : entangled(selectedTokens);
      }

      setSelectedTokens([]);
    } catch (e) {
      console.log(e);
      toast.error(`Entanglement failed: ${e}`);
    } finally {
      setIsEntangling(false);
    }
  };

  const handleBurn = async () => {
    if (!wallet || selectedTokens.length == 0 || !connection) {
      return;
    }

    setIsEntangling(true);

    try {
      const txs = [];

      for (const token of selectedTokens) {
        const tx = new Transaction(await connection.getLatestBlockhash());
        const entangler = new EntanglerWrapper(
          OG_DIPPIES_MINT,
          wallet.publicKey!,
          DIPPIES_KEY,
          DIPPIES_DAO_KEY,
          500
        );

        try {
          const entangledMint = getEntangledMint(DIPPIES_KEY, token.address);
          const entangledPairKey = getEntangledPair(entangledMint);
          const entangledPair = await EntangledPair.fetch(
            connection,
            entangledPairKey
          );
        } catch {
          toast.error(`Can't burn the original token for ${token.name}`);
        }

        tx.add(entangler.instruction.burnOriginal(token.mint.address));

        tx.feePayer = wallet.publicKey!;
        txs.push(tx);
      }

      console.log(txs);

      const signed = await wallet.signAllTransactions!(txs);
      await Promise.all(
        signed.map(
          async (tx) =>
            await connection.confirmTransaction(
              await connection.sendRawTransaction(tx.serialize(), {
                skipPreflight: true,
              })
            )
        )
      );

      setSelectedTokens([]);
    } catch (e) {
      console.log(e);
      toast.error(`Entanglement failed: ${e}`);
    } finally {
      setIsEntangling(false);
    }
  };

  console.log(selectedTokens.map((e) => e.address.toString()));

  return (
    <div className="rounded-xl bg-base-200 m-5 shadow-xl">
      {selectedTokens.length > 0 ? (
        <div className="flex flex-col gap-3 bg-base-200 max-w-xl mx-auto rounded-lg p-5 justify-center">
          <h4 className="text-3xl font-bold text-center">
            {disentangle ? "Disentangle" : "Entangle"} {selectedTokens.length}{" "}
            Dippies
          </h4>
          <div className="w-32 sm:w-48 mx-auto">
            <div className="stack">
              {selectedTokens.map((token, i) => (
                <img
                  className={`w-32 sm:w-48 rounded-md`}
                  src={token.json?.image}
                />
              ))}
            </div>
          </div>
          <div
            className={`btn btn-lg btn-primary flex flex-row gap-5 ${
              selectedTokens.length !== 0 ? "" : "btn-disabled"
            } ${isEntangling ? "loading btn-disabled" : ""}`}
            onClick={handleEntangle}
          >
            {disentangle ? "Disentangle" : "Entangle"}
            <span className="text-xl">{selectedTokens.length}</span>
            <PaperAirplaneIcon className="w-8 h-8" />
          </div>
          {
            !disentangle ? (
              <label className="label cursor-pointer">
                <div className="flex flex-row gap-3">
                  <span className="label-text font-bold">
                    Burn the original
                  </span>
                  <span
                    className="tooltip"
                    data-tip="Checking this box burns the original token to save some SOL"
                  >
                    <FaQuestionCircle className="my-auto" />
                  </span>
                </div>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={burnOriginal}
                  onChange={() => setBurnOriginal((e) => !e)}
                />
              </label>
            ) : null
            // (
            //   <div className="flex flex-row gap-3">
            //     <div
            //       className="tooltip m-auto"
            //       data-tip="This will burn the original tokens to save some SOL"
            //     >
            //       <div
            //         className={`btn btn-secondary w-fit mx-auto ${
            //           isEntangling ? "btn-disabled loading" : ""
            //         }`}
            //         onClick={handleBurn}
            //       >
            //         <div>Burn original</div>
            //         <FaQuestionCircle className="ml-2 my-auto" />
            //       </div>
            //     </div>
            //   </div>
            // )
          }
        </div>
      ) : null}
      {tokens && tokens.length > 0 ? (
        <div className="flex flex-col p-5 gap-3">
          <div className="text-center text-3xl font-bold">
            Select tokens to {disentangle ? "disentangle" : "entangle"}
          </div>
          {selectedTokens.length > 0 ? (
            <div
              className="btn btn-primary w-fit m-auto"
              onClick={() => setSelectedTokens([])}
            >
              Deselect all tokens
            </div>
          ) : (
            <div
              className="btn btn-primary w-fit m-auto"
              onClick={() => setSelectedTokens(tokens)}
            >
              Select all tokens
            </div>
          )}
          <div className="flex flex-wrap justify-center">
            {tokens.map((token) => (
              <div
                key={token.address.toString()}
                className={`m-2 static flex flex-col w-32 sm:w-48 rounded-lg shadow-xl bg-neutral ${
                  selectedTokens.includes(token) ? "border-2 border-accent" : ""
                }`}
                onClick={() =>
                  !selectedTokens.includes(token)
                    ? setSelectedTokens((old) => [...old, token])
                    : setSelectedTokens((old) =>
                        old.filter((e) => !e.address.equals(token.address))
                      )
                }
              >
                {selectedTokens.includes(token) ? (
                  <div className="absolute p-1">
                    <FaCheckCircle className="text-accent w-8 h-8" />
                  </div>
                ) : null}
                <img className="w-56 rounded-t-md" src={token.json?.image} />
                <span className="text-xl font-bold text-center p-3 text-neutral-content">
                  {token.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {isFetching ? (
            <div className="text-center text-3xl p-5">
              <span>Fetching tokens...</span>
              <progress className="progress"></progress>
            </div>
          ) : (
            <div className="text-center font-bold text-3xl p-5">
              No tokens to {disentangle ? "disentangle" : "entangle"}
            </div>
          )}
        </>
      )}
    </div>
  );
};
