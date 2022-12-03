import { BN } from "@project-serum/anchor";
import { DecimalUtil } from "@orca-so/sdk";
import { FC } from "react";
import { PublicKey } from "@solana/web3.js";
import { shortAddress } from "../utils";
import useToken from "../hooks/useToken";
import useTokens from "../hooks/useTokens";

type Props = {
  mint: PublicKey;
  amount: BN;
};

export const TokenInfo: FC<Props> = ({ mint, amount }) => {
  const { token } = useToken(mint);
  const { map } = useTokens();
  const info = map?.get(mint.toString());

  return (
    <div className="font-bold">
      {token ? (
        <div className="flex flex-row">
          {DecimalUtil.fromU64(amount, token.decimals).toFixed(2)}{" "}
          {info ? (
            <div className="tooltip my-auto" data-tip={info.name}>
              <img src={info.logoURI} className="w-5 h-5 rounded-full" />
            </div>
          ) : (
            shortAddress(mint)
          )}
        </div>
      ) : null}
    </div>
  );
};
