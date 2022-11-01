import { DIPPIES_DAO_KEY, DIPPIES_KEY } from "../../utils/ids";
import {
  ENTANGLEMENT_PAIR_SEED,
  EntanglerWrapper,
} from "../../programs/entangler";
import { Metaplex, Nft } from "@metaplex-foundation/js";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";

import { PROGRAM_ID as ENTANGLER_ID } from "../../programs/entangler/programId";
import { EntangledPair } from "../../programs/entangler/accounts/EntangledPair";
import { FaCheckCircle } from "react-icons/fa";
import PaperAirplaneIcon from "@heroicons/react/24/outline/PaperAirplaneIcon";
import React from "react";
import { Wallet } from "@project-serum/anchor";
import { getMint } from "@solana/spl-token";
import useUserNfts from "../../hooks/useUserNfts";

const AUTHORITY_SEED = "authority";
const COLLECTION_SEED = "collection";
const COLLECTION_MINT_SEED = "collection-mint";
const ENTANGLEMENT_MINT_SEED = "entanglement-mint";

export const Disentangler = () => {
  const { connection } = useConnection();
  const { entangledTokens, fetchTokens } = useUserNfts();
  const wallet = useWallet();

  const [isEntangling, setIsEntangling] = useState(false);
  const [entangledPair, setEntangledPair] = useState(
    localStorage.getItem("entangledPair") || ""
  );
  const [token, setToken] = useState<Nft>();

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as Wallet;
  }, [wallet]);

  useEffect(() => {
    (async () => {
      if (!anchorWallet) {
        return;
      }
    })();
  }, [anchorWallet]);

  const handleEntangle = async () => {
    if (!wallet || !token || !connection) {
      return;
    }

    setIsEntangling(true);

    try {
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

      const tx = new Transaction(await connection.getLatestBlockhash());

      const [entangledPairKey] = PublicKey.findProgramAddressSync(
        [Buffer.from(ENTANGLEMENT_PAIR_SEED), token.address.toBuffer()],
        ENTANGLER_ID
      );
      const entangledPair = await EntangledPair.fetch(
        connection,
        entangledPairKey
      );
      tx.add(entangler.instruction.disentangle(entangledPair?.originalMint!));
      console.log(tx.instructions[0].keys.map((e) => e.pubkey.toString()));

      await connection.confirmTransaction(
        await wallet.sendTransaction(tx, connection)
      );

      fetchTokens();
      setToken(undefined);
    } catch (e) {
      console.log("Entangle failed:", e);
    } finally {
      setIsEntangling(false);
    }
  };

  console.log(entangledTokens);
  return (
    <div className="rounded-xl bg-base-200 m-5 shadow-xl border-2">
      {token ? (
        <div className="flex flex-col gap-3 bg-base-200 max-w-xl mx-auto rounded-lg p-5 justify-center">
          <h4 className="text-3xl text-center">Entangle {token.name}</h4>
          <div className="w-56 mx-auto">
            <img className="w-56 rounded-md" src={token.json?.image} />
          </div>
          <div
            className={`btn btn-lg btn-primary flex flex-row gap-5 ${
              token ? "" : "btn-disabled"
            } ${isEntangling ? "loading btn-disabled" : ""}`}
            onClick={handleEntangle}
          >
            Disentangle
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
      {entangledTokens ? (
        <div className="flex flex-col p-5">
          {entangledTokens.length > 0 ? (
            <span className="text-center text-3xl">
              Select a Dippie to disentangle
            </span>
          ) : (
            <span className="text-center text-3xl">
              No Dippies to disentangle
            </span>
          )}
          <div className="flex flex-wrap">
            {entangledTokens.map((e) => (
              <div
                key={e.address.toString()}
                className={`m-3 static flex flex-col w-56 rounded-lg shadow-xl border-2 ${
                  e === token ? "border-accent" : ""
                }`}
                onClick={() => setToken(e)}
              >
                {token === e ? (
                  <div className="absolute p-1">
                    <FaCheckCircle className="text-accent w-8 h-8" />
                  </div>
                ) : null}
                <img className="w-56 rounded-t-md" src={e.json?.image} />
                <span className="text-xl font-bold text-center p-3">
                  {e.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
