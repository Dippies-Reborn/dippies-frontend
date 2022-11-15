import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';

import { PublicKey } from '@solana/web3.js';

export const getAssociatedTokenKey = (owner: PublicKey, mint: PublicKey) => {
  return PublicKey.findProgramAddressSync([owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], ASSOCIATED_PROGRAM_ID)[0]
}