import { BN } from "@project-serum/anchor";
import { DecimalUtil } from "@orca-so/sdk";
import { FC } from "react";
import { PublicKey } from "@solana/web3.js";
import { shortAddress } from "../utils";
import useToken from "../hooks/useToken";

type Props = {
  mint: PublicKey;
  amount: BN;
};

export const TokenInfo: FC<Props> = ({ mint, amount }) => {
  const { token } = useToken(mint);

  return (
    <div className="font-bold">
      {token ? (
        <div>
          {DecimalUtil.fromU64(amount, token.decimals).toFixed(2)}{" "}
          {shortAddress(mint)}
        </div>
      ) : null}
    </div>
  );
};
