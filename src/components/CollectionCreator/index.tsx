import { BN, utils } from "@project-serum/anchor";
import { EntanglerState, EntanglerWrapper } from "../../programs/entangler";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  NATIVE_MINT,
  createSyncNativeInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { FaWindowClose } from "react-icons/fa";

export default () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [entanglerState, setEntanglerState] = useState<EntanglerState>();
  const [mint, setMint] = useState<PublicKey>();
  const [royalties, setRoyalties] = useState<PublicKey>();
  const [percentage, setPercentage] = useState<number>();
  const [oneWay, setOneWay] = useState<boolean>(false);
  const [key, setKey] = useState<string>();

  const fetchState = async () => {
    const state = await EntanglerState.fetch(
      connection,
      EntanglerWrapper.address.entanglerState()
    );

    if (state) setEntanglerState(state);
  };
  useEffect(() => {
    if (!entanglerState) fetchState();
  }, [entanglerState, connection]);

  const handleMint: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    try {
      setMint(new PublicKey(e.target.value));
    } catch {
      setMint(undefined);
    }
  };
  const handleRoyalties: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    try {
      setRoyalties(new PublicKey(e.target.value));
    } catch {
      setRoyalties(undefined);
    }
  };
  const handlePercentage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPercentage(Number(e.target.value));
  };
  const handleOneWay = () => {
    setOneWay((old) => !old);
  };
  const handleKey: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setKey(e.target.value);
  };

  const handleCreate = async () => {
    if (
      !mint ||
      !wallet.publicKey ||
      !royalties ||
      !percentage ||
      !key ||
      !entanglerState
    )
      return;
    const entangler = new EntanglerWrapper(
      mint,
      wallet.publicKey,
      Keypair.generate().publicKey,
      royalties,
      Math.round(percentage * 100)
    );

    await wallet.sendTransaction(
      new Transaction()
        .add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: getAssociatedTokenAddressSync(
              NATIVE_MINT,
              wallet.publicKey,
              true
            ),
            lamports: entanglerState.price.toNumber(),
          })
        )
        .add(
          createSyncNativeInstruction(
            getAssociatedTokenAddressSync(NATIVE_MINT, wallet.publicKey, true)
          )
        )
        .add(entangler.instruction.createCollection(oneWay))
        .add(
          entangler.instruction.createCollectionEntry(
            key,
            entanglerState.feeMint,
            entanglerState.earner
          )
        ),
      connection
    );

    setIsOpen(false);
    setMint(undefined);
    setRoyalties(undefined);
    setPercentage(undefined);
    setKey(undefined);
  };

  return (
    <div className="flex">
      <div
        className="btn btn-primary btn-large mx-auto"
        onClick={() => setIsOpen(true)}
      >
        Create a registered collection
      </div>
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <div className="flex flex-row justify-between">
            <div className="text-xl font-bold my-auto">Creator</div>
            <div className="btn btn-ghost" onClick={() => setIsOpen(false)}>
              <FaWindowClose className="w-8 h-8" />
            </div>
          </div>
          <div className="form flex flex-col gap-2">
            <div className="">
              <div className="font-bold">Original collection mint</div>
              <div className="text-sm text-neutral-content">
                You can find it in the "collection" field of your token's
                metadata.
              </div>
              <input
                className="input input-bordered w-full"
                onChange={handleMint}
              />
            </div>
            <div className="">
              <div className="font-bold">Royalties earner</div>
              <div className="text-sm text-neutral-content">
                The wallet that will receive royalties.
              </div>
              <input
                className="input input-bordered w-full"
                onChange={handleRoyalties}
              />
            </div>
            <div className="">
              <div className="font-bold">Royalties</div>
              <div className="text-sm text-neutral-content">
                The percentage taken for royalties on each trade.
              </div>
              <input
                className="input input-bordered w-full"
                type="number"
                onChange={handlePercentage}
              />
            </div>

            <div className="">
              <div className="font-bold">Reversable</div>
              <div className="text-sm text-neutral-content">
                Whether it's possible to convert entangled tokens back to the
                original collection.
              </div>
              <input
                className="checkbox"
                type="checkbox"
                defaultChecked
                onChange={handleOneWay}
              />
            </div>
            <div className="">
              <div className="font-bold">Registry key</div>
              <div className="text-sm text-neutral-content">
                A human readable key in snake case (written_like_this).
              </div>
              <input
                className="input input-bordered w-full"
                onChange={handleKey}
              />
            </div>
            <div
              className={`btn ${
                !mint || !royalties || !percentage || !key ? "btn-disabled" : ""
              } w-full`}
              onClick={handleCreate}
            >
              Create a collection for{" "}
              {entanglerState?.price.div(new BN(LAMPORTS_PER_SOL)).toString()}{" "}
              SOL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
