import React, { useEffect, useState } from "react";
import { TokenInfo, TokenListProvider } from "@solana/spl-token-registry";

import useNetwork from "../hooks/useNetwork";

interface UserNftsContextProps {
  tokenMap?: Map<string, TokenInfo>;
  tokenNames?: Map<string, string>;
}

export const TokensContext = React.createContext<UserNftsContextProps>({
  tokenMap: new Map(),
  tokenNames: new Map(),
});

export const TokensProvider = ({ children }: { children: React.ReactNode }) => {
  const { slug } = useNetwork();
  const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());
  const [tokenNames, setTokenNames] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    new TokenListProvider().resolve().then((tokens) => {
      const tokenList = tokens.filterByClusterSlug(slug).getList();

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
