import { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  getAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

export const useTokenBalance = (walletAddress?: any) => {
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const connection = new Connection(import.meta.env.VITE_SOL_RPC);
        const publicKey = new PublicKey(walletAddress);
        const TOKEN_ADDRESS = import.meta.env.VITE_SPL_TOKEN_ADDRESS;
        const tokenPublicKey = new PublicKey(TOKEN_ADDRESS);

        const associatedAddress = await getAssociatedTokenAddress(
          tokenPublicKey,
          publicKey
        );
        const account = await getAccount(connection, associatedAddress);

        setBalance(Number(account.amount) / (10 ** 6));
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchBalance();
    }
  }, [walletAddress]);

  return { balance, loading, error };
};
