import { DIPPIES_DAO_KEY, DIPPIES_KEY } from "../../utils/ids";
import {
  ENTANGLEMENT_PAIR_SEED,
  EntanglerWrapper,
} from "../../programs/entangler";
import { PublicKey, Transaction, VersionedMessage } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";

import { PROGRAM_ID as ENTANGLER_ID } from "../../programs/entangler/programId";
import { EntangledPair } from "../../programs/entangler/accounts/EntangledPair";
import { FaCheckCircle } from "react-icons/fa";
import { Nft } from "@metaplex-foundation/js";
import PaperAirplaneIcon from "@heroicons/react/24/outline/PaperAirplaneIcon";
import React from "react";
import { Wallet } from "@project-serum/anchor";
import { getMint } from "@solana/spl-token";
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
    fetchTokens,
  } = useUserNfts();
  const tokens = disentangle ? entangledTokens : originalTokens;
  const wallet = useWallet();

  const [isEntangling, setIsEntangling] = useState(false);
  const [entangledPair, setEntangledPair] = useState(
    localStorage.getItem("entangledPair") || ""
  );
  const [selectedTokens, setSelectedTokens] = useState<Nft[]>([]);

  const handleEntangle = async () => {
    if (!wallet || selectedTokens.length == 0 || !connection) {
      return;
    }

    setIsEntangling(true);

    const txs = [];
    try {
      const tx = new Transaction(await connection.getLatestBlockhash());

      for (const token of selectedTokens) {
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
            const entangledMintInfo = await getMint(connection, entangledMint);
            console.log(
              "Entangled Mint:",
              entangledMintInfo.address.toString()
            );
          } catch (e) {
            console.log("Pair not created");
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

        txs.push(tx);
      }

      await connection.confirmTransaction(
        await wallet.sendTransaction(tx, connection)
      );

      fetchTokens();
      setSelectedTokens([]);
    } catch (e) {
      console.log("Entanglement failed:", e);
    } finally {
      setIsEntangling(false);
    }
  };

  console.log(tokens, selectedTokens);
  return (
    <div className="rounded-xl bg-base-200 m-5 shadow-xl border-2">
      {selectedTokens.length > 0 ? (
        <div className="flex flex-col gap-3 bg-base-200 max-w-xl mx-auto rounded-lg p-5 justify-center">
          <h4 className="text-3xl text-center">
            {disentangle ? "Disentangle" : "Entangle"} {selectedTokens.length}{" "}
            Dippies
          </h4>
          <div className="w-56 mx-auto">
            <div className="stack">
              {selectedTokens.map((token) => (
                <img className="w-56 rounded-md" src={token.json?.image} />
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

          <span className="block mt-2">
            {!entangledPair ? (
              ""
            ) : (
              <h5 color="text.primary">Entangled Pair swap complete!</h5>
            )}
            <p>{entangledPair}</p>
          </span>
        </div>
      ) : null}
      {tokens && tokens.length > 0 ? (
        <div className="flex flex-col p-5">
          <span className="text-center text-3xl">
            Select up to 2 Dippies to {disentangle ? "disentangle" : "entangle"}
          </span>
          <div className="flex flex-wrap">
            {tokens.map((token) => (
              <div
                key={token.address.toString()}
                className={`m-3 static flex flex-col w-56 rounded-lg shadow-xl border-2 ${
                  selectedTokens.includes(token) ? "border-accent" : ""
                }`}
                onClick={() =>
                  !selectedTokens.includes(token)
                    ? selectedTokens.length < 2
                      ? setSelectedTokens((old) => [...old, token])
                      : null
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
                <span className="text-xl font-bold text-center p-3">
                  {token.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <span className="text-center text-3xl p-5">
          No Dippies to {disentangle ? "disentangle" : "entangle"}
        </span>
      )}
    </div>
  );
};
