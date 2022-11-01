import { FC, useEffect } from "react";

import { shortAddress } from "../utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

type Props = {};

export const SelectAndConnectWalletButton: FC<Props> = ({}) => {
  const { setVisible } = useWalletModal();
  const { wallet, connect, connecting, publicKey } = useWallet();

  useEffect(() => {
    if (!publicKey && wallet) {
      try {
        connect();
      } catch (error) {
        console.log("Error connecting to the wallet: ", (error as any).message);
      }
    }
  }, [wallet]);

  const handleWalletClick = () => {
    try {
      if (!wallet) {
        setVisible(true);
      } else {
        connect();
      }
    } catch (error) {
      console.log("Error connecting to the wallet: ", (error as any).message);
    }
  };

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={handleWalletClick}
        disabled={connecting}
      >
        {publicKey ? (
          <div>{shortAddress(publicKey)}</div>
        ) : (
          <div>Connect Wallet</div>
        )}
      </button>
    </>
  );
};
