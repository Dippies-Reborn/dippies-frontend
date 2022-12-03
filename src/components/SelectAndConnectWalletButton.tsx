import { FC, useEffect, useState } from "react";

import { BsCheck } from "react-icons/bs";
import { CheckmarkIcon } from "react-hot-toast";
import { shortAddress } from "../utils";
import useNetwork from "../hooks/useNetwork";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

type Props = {};

export const SelectAndConnectWalletButton: FC<Props> = ({}) => {
  const { setVisible } = useWalletModal();
  const { networks, name, changeNetwork } = useNetwork();
  const { wallet, connect, connecting, publicKey } = useWallet();
  const [showMenu, setShowMenu] = useState(false);

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
      {publicKey ? (
        <div className="relative">
          <div className="btn menu" onClick={() => setShowMenu((old) => !old)}>
            <div>{shortAddress(publicKey)}</div>
          </div>
          {showMenu ? (
            <div className="absolute menu bg-base-200 m-1 p-2 rounded-box right-0">
              <ul>
                {networks.map((network, i) => (
                  <li
                    key={network.slug + i}
                    onClick={() => changeNetwork(network.name)}
                  >
                    <div>
                      {network.name === name ? <BsCheck /> : null}
                      {network.name}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <button
          className="btn btn-primary"
          onClick={handleWalletClick}
          disabled={connecting}
        >
          <div>Connect Wallet</div>
        </button>
      )}
    </>
  );
};
