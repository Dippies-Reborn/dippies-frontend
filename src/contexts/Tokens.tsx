import React, { useEffect, useState } from "react";
import { TokenInfo, TokenListProvider } from "@solana/spl-token-registry";

import { DIPPIES_TOKEN } from "../utils/ids";
import useNetwork from "../hooks/useNetwork";

interface UserNftsContextProps {
  tokenMap?: Map<string, TokenInfo>;
  tokenNames?: Map<string, string>;
}

export const TokensContext = React.createContext<UserNftsContextProps>({
  tokenMap: new Map(),
  tokenNames: new Map(),
});

const knownTokens: TokenInfo[] = [
  {
    chainId: 3,
    address: DIPPIES_TOKEN.toString(),
    name: "Dip",
    symbol: "DIP",
    decimals: 6,
    logoURI:
      "https://cdn.discordapp.com/icons/985261996435992576/3801bb398bf66e30bd52dbb52b262a79.webp?size=240",
  },
];

export const TokensProvider = ({ children }: { children: React.ReactNode }) => {
  const { slug } = useNetwork();
  const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(
    new Map(knownTokens.map((e) => ["Mainnet", e]))
  );
  const [tokenNames, setTokenNames] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    new TokenListProvider().resolve().then((tokens) => {
      const tokenList = knownTokens.concat(
        tokens.filterByClusterSlug(slug).getList()
      );

      setTokenMap(
        tokenList.reduce((map, item) => {
          map.set(item.address, item);
          return map;
        }, new Map())
      );
      setTokenNames(
        tokenList.reduce((map, item) => {
          map.set(item.name, item.address);
          return map;
        }, new Map())
      );
    });
  }, [setTokenMap]);

  return (
    <TokensContext.Provider value={{ tokenMap, tokenNames }}>
      {children}
    </TokensContext.Provider>
  );
};
