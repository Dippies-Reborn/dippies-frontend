import { DIPPIES_DAO_KEY, DIPPIES_KEY } from "../../utils/ids";
import {
  ENTANGLEMENT_PAIR_SEED,
  EntanglerWrapper,
} from "../../programs/entangler";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { PROGRAM_ID as ENTANGLER_ID } from "../../programs/entangler/programId";
import { EntangledPair } from "../../programs/entangler/accounts/EntangledPair";
import { FaCheckCircle } from "react-icons/fa";
import { Nft } from "@metaplex-foundation/js";
import PaperAirplaneIcon from "@heroicons/react/24/outline/PaperAirplaneIcon";
import React from "react";
import { getMint } from "@solana/spl-token";
import { toast } from "react-hot-toast";
import { useState } from "react";
import useUserNfts from "../../hooks/useUserNfts";

const AUTHORITY_SEED = "authority";
const COLLECTION_SEED = "collection";
const COLLECTION_MINT_SEED = "collection-mint";
const ENTANGLEMENT_MINT_SEED = "entanglement-mint";

export const Entangler = ({ disentangle }: { disentangle?: boolean }) => {
  const { connection } = useConnection();
  const {
    tokens: originalTokens,
    entangledTokens,
    isFetching,
    fetchTokens,
  } = useUserNfts();
  const tokens = disentangle ? entangledTokens : originalTokens;
  const wallet = useWallet();

  const [isEntangling, setIsEntangling] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<Nft[]>([]);

  const handleEntangle = async () => {
    if (!wallet || selectedTokens.length == 0 || !connection) {
      return;
    }

    setIsEntangling(true);

    try {
      const txs = [];

      for (const token of selectedTokens) {
        const tx = new Transaction(await connection.getLatestBlockhash());
        const entangler = new EntanglerWrapper(
          token.address,
          wallet.publicKey!,
          DIPPIES_KEY,
          DIPPIES_DAO_KEY,
          500
        );

        const [entangledMint] = PublicKey.findProgramAddressSync(
          [
            Buffer.from(ENTANGLEMENT_MINT_SEED),
            DIPPIES_KEY.toBuffer(),
            token.address.toBuffer(),
          ],
          ENTANGLER_ID
        );

        if (!disentangle) {
          // Find the pair
          try {
            await getMint(connection, entangledMint);
          } catch (e) {
            tx.add(entangler.instruction.initializePair(token.address));
          }

          tx.add(entangler.instruction.entangle(token.address));
        } else {
          const [entangledPairKey] = PublicKey.findProgramAddressSync(
            [Buffer.from(ENTANGLEMENT_PAIR_SEED), token.address.toBuffer()],
            ENTANGLER_ID
          );
          const entangledPair = await EntangledPair.fetch(
            connection,
            entangledPairKey
          );
          tx.add(
            entangler.instruction.disentangle(entangledPair?.originalMint!)
          );
        }

        tx.feePayer = wallet.publicKey!;
        txs.push(tx);
      }

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

      fetchTokens();
      setSelectedTokens([]);
    } catch (e) {
      console.log(e);
      toast(`Entanglement failed: ${e}`);
    } finally {
      setIsEntangling(false);
    }
  };

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
        </div>
      ) : null}
      {tokens && tokens.length > 0 ? (
        <div className="flex flex-col p-5">
          <span className="text-center text-3xl font-bold">
            Select Dippies to {disentangle ? "disentangle" : "entangle"}
          </span>
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
            <span className="text-center font-bold text-3xl p-5">
              No tokens to {disentangle ? "disentangle" : "entangle"}
            </span>
          )}
        </>
      )}
    </div>
  );
};
