import { TokensContext } from "../contexts/Tokens";
import { useContext } from "react";

export default function useTokens() {
  const { tokenMap: map, tokenNames: names } = useContext(TokensContext);
  return { map, names };
}
