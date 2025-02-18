import { useCallback, useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, BN, web3 } from "@project-serum/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  getAccount,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import { ChevronRight } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CustomSolanaButton from "../WalletConnect/solConnectBtn";
import { useToast } from "@/hooks/use-toast";
import { HOST_CONTRACT } from "@/contracts/host.contract.abi";
import { handleUserTx } from "@/axios/axios";

const TOKEN_MINT = new PublicKey(
  "27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL"
);
const programID = new PublicKey(HOST_CONTRACT.PROGRAM_ID);
const tokenDecimals = 6;

function computeFloatVals(
  a: string,
  b: string,
  precision: number = 6,
  addValues: boolean = false
): number {
  const factor = Math.pow(10, precision); // Scale factor based on precision
  const numA = parseFloat(a); // Convert string to float
  const numB = parseFloat(b); // Convert string to float
  const result = addValues
    ? (Math.round(numA * factor) + Math.round(numB * factor)) / factor
    : (Math.round(numA * factor) - Math.round(numB * factor)) / factor;
  return result;
}
const StakePopup = () => {
  const wallet: any = useWallet();

  const { connection } = useConnection();
  // const { balance } = useTokenBalance(wallet?.publicKey);
  const { toast } = useToast();
  const [isStake, setStake] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [vaultBalanceofUser, setVaultBalanceofUser] = useState(0);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState(null);
  // const [isMobile, setIsMobile] = useState(false);
  const fetchBalance = async (wallet: any) => {
    try {
      setLoading(true);
      const connection = new Connection(
        "https://aged-clean-dream.solana-mainnet.quiknode.pro/51a78aa7597a179d9adb3aa72df855eff57fc23a"
      );
      const publicKey = new PublicKey(wallet?.publicKey);
      // const TOKEN_ADDRESS = import.meta.env.VITE_SPL_TOKEN_ADDRESS;
      const TOKEN_ADDRESS = "27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL";
      const tokenPublicKey = new PublicKey(TOKEN_ADDRESS);

      const associatedAddress = await getAssociatedTokenAddress(
        tokenPublicKey,
        publicKey
      );
      const account = await getAccount(connection, associatedAddress);
      setBalance(Number(account.amount) / 10 ** 6);
    } catch (err: any) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (wallet?.publicKey) {
      fetchBalance(wallet);
    }
  }, [wallet?.publicKey, isStake, error]);

  const [loading, setLoading] = useState(false);
  const getProvider = () => {
    if (!wallet.publicKey) throw new Error("Wallet not connected!");
    return new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
  };

  const getProgram = useCallback(() => {
    const provider = getProvider();
    return new Program(HOST_CONTRACT.IDL, programID, provider);
  }, [wallet.publicKey, connection]);
  const getUserBalance = async (wallet: any) => {
    try {
      // Derive PDA for deposit info account
      const [depositInfoPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("deposit_info"), wallet.publicKey.toBuffer()],
        programID
      );

      // Get the provider
      const provider = getProvider();

      // Fetch the account info
      const accountInfo =
        await provider.connection.getAccountInfo(depositInfoPDA);

      // If account doesn't exist, return 0 balance
      if (!accountInfo) {
        setVaultBalanceofUser(0);
        return 0;
      }

      const amount = accountInfo.data.slice(40, 48); // Get the amount (8 bytes after user pubkey)

      // Convert the balance bytes to BigInt (u64)
      const userBalance = Buffer.from(amount).readBigUInt64LE();
      const formatted_balance =
        Number(userBalance) / Math.pow(10, tokenDecimals);
      setVaultBalanceofUser(formatted_balance);
      return formatted_balance;
    } catch (error) {
      console.error("Error fetching user balance:", error);
      throw error;
    }
  };

  const validateTransaction = (amount: any, stakeBalance?: any) => {
    if (!wallet.publicKey) {
      toast({
        title: "Please connect your wallet ",
      });
      return false;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      toast({
        title: "Please enter a valid amount ",
      });
      return false;
    }

    if (isStake && parseFloat(amount) > (balance || 0)) {
      toast({
        title: "Insufficient balance ",
      });
      return false;
    }

    if (!isStake && parseFloat(amount) > parseFloat(stakeBalance)) {
      toast({
        title: "Insufficient staked balance",
      });
      return false;
    }

    return true;
  };

  const depositTokens = async () => {
    if (!validateTransaction(depositAmount)) return;

    setLoading(true);
    try {
      const program = getProgram();

      // Get user's Associated Token Account
      const userMintTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet.publicKey,
        TOKEN_MINT,
        wallet.publicKey
      );

      // Get PDA accounts
      const [platformConfig] = await PublicKey.findProgramAddress(
        [Buffer.from("platform_config")],
        program.programId
      );

      const [platformMintTokenAccount] = await PublicKey.findProgramAddress(
        [Buffer.from("platform_mint_token_account")],
        program.programId
      );

      const [depositInfo] = await PublicKey.findProgramAddress(
        [Buffer.from("deposit_info"), wallet.publicKey.toBuffer()],
        program.programId
      );

      // Execute deposit transaction
      const txSignature = await program.methods
        .deposit(new BN(parseFloat(depositAmount) * 10 ** tokenDecimals))
        .accounts({
          user: wallet.publicKey,
          mint: TOKEN_MINT,
          platformConfig: platformConfig,
          platformMintTokenAccount: platformMintTokenAccount,
          userMintTokenAccount: userMintTokenAccount.address,
          depositInfo: depositInfo,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      // Wait for transaction confirmation
      // Wait for transaction confirmation
      const confirmation = await connection.confirmTransaction(
        txSignature,
        "confirmed"
      );
      await connection.getBlock(confirmation.context.slot, {
        maxSupportedTransactionVersion: 0,
      });

      await handleUserTx({
        amount: Number(depositAmount),
        action: "stake",
        address: wallet.publicKey.toString(),
        hash: txSignature,
      });
      // Update UI state
      setBalance(computeFloatVals(String(balance), depositAmount));
      setDepositAmount("");
      toast({
        title: "Staked Successfully",
      });
    } catch (error) {
      console.error("Error depositing tokens:", error);
      toast({
        title: "Failed to deposit tokens",
      });
    } finally {
      setLoading(false);
    }
  };

  const withdrawTokens = async () => {
    const balance = await getUserBalance(wallet);

    if (!validateTransaction(withdrawAmount, balance)) return;
    setLoading(true);
    try {
      const program = getProgram();

      // Get user's Associated Token Account
      const userMintTokenAccount = await getAssociatedTokenAddress(
        TOKEN_MINT,
        wallet.publicKey
      );

      // Get PDA accounts
      const [platformConfig] = await PublicKey.findProgramAddress(
        [Buffer.from("platform_config")],
        program.programId
      );

      const [platformMintTokenAccount] = await PublicKey.findProgramAddress(
        [Buffer.from("platform_mint_token_account")],
        program.programId
      );

      const [depositInfo] = await PublicKey.findProgramAddress(
        [Buffer.from("deposit_info"), wallet.publicKey.toBuffer()],
        program.programId
      );

      // Execute withdrawal transaction
      const txSignature = await program.methods
        .withdraw(new BN(parseFloat(withdrawAmount) * 10 ** tokenDecimals))
        .accounts({
          user: wallet.publicKey,
          mint: TOKEN_MINT,
          platformConfig: platformConfig,
          platformMintTokenAccount: platformMintTokenAccount,
          userMintTokenAccount: userMintTokenAccount,
          depositInfo: depositInfo,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      // Wait for transaction confirmation
      const confirmation = await connection.confirmTransaction(
        txSignature,
        "confirmed"
      );
      await connection.getBlock(confirmation.context.slot, {
        maxSupportedTransactionVersion: 0,
      });

      await handleUserTx({
        amount: Number(withdrawAmount),
        action: "unstake",
        address: wallet.publicKey.toString(),
        hash: txSignature,
      });
      // Update UI state
      await fetchBalance(wallet);
      setWithdrawAmount("");
      setVaultBalanceofUser(computeFloatVals(String(balance), withdrawAmount));
      toast({
        title: "Successfully withdrew tokens",
      });
    } catch (error) {
      console.error("Error withdrawing tokens:", error);
      toast({
        title: "Failed to withdraw tokens",
      });
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   // Function to check if screen width is mobile
  //   const checkIsMobile = () => {
  //     setIsMobile(window.innerWidth <= 768);
  //   };

  //   // Check initially
  //   checkIsMobile();

  //   // Add event listener for window resize
  //   window.addEventListener("resize", checkIsMobile);

  //   // Cleanup
  //   return () => window.removeEventListener("resize", checkIsMobile);
  // }, []);

  return (
    <div className=" relative max-w-[70%] w-[70%]  gap-0 border-2 border-primary  bg-[#181818] p-0 pt-0">
      <div className="absolute w-4 h-4 bg-primary left-[-10px] top-[-10px]"></div>
      <div className="absolute w-4 h-4 bg-primary right-[-10px] top-[-10px]"></div>
      <div className="absolute w-4 h-4 bg-primary left-[-10px] bottom-[-10px]"></div>
      <div className="absolute w-4 h-4 bg-primary right-[-10px] bottom-[-10px]"></div>

      <div className="flex justify-between w-full ">
        <div
          onClick={async () => {
            setStake(true);
            setDepositAmount("");
            fetchBalance(wallet);
          }}
          className={`px-4 w-full uppercase text-md py-2 text-center font-semibold cursor-pointer ${
            isStake ? "bg-primary text-[#010101]" : "bg-[#181818] text-[#fff]"
          }`}
        >
          {">> stake_$rogue"}
        </div>
        <div
          onClick={async () => {
            setStake(false);
            setWithdrawAmount("");
            getUserBalance(wallet);
          }}
          className={`px-4 w-full uppercase text-md text-center font-semibold py-2 cursor-pointer ${
            isStake ? "bg-[#181818] text-[#fff]" : "bg-primary text-[#010101]"
          }`}
        >
          {">> unstake_$rogue"}
        </div>
      </div>

      <div className="flex-1   w-full pb-4">
        <div className="flex flex-col h-full py-6 px-6 w-full border-primary border-t-[1px] justify-center items-center gap-4 ]">
          <div className="flex gap-3 w-full flex-wrap">
            <div className="flex w-full flex-col gap-2 text-[#F1F6F2]">
              {/* {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                 */}
              <div className="flex w-full justify-between uppercase">
                {/* {isStake ? (
                    <div>
                      Available Balance: {balance?.toFixed(5) ?? 0} ROGUE
                    </div>
                  ) : (
                    <div>
                      Staked Balance: {vaultBalanceofUser.toFixed(5)} ROGUE
                    </div>
                  )} */}

                <div>enter amount of $ROGUE to unstake</div>
              </div>

              <div className="flex w-full border-[1px] border-primary">
                <Input
                  className=" border-none uppercase hover:bg-[#303030]"
                  value={isStake ? depositAmount : withdrawAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isStake) {
                      setDepositAmount(value);
                    } else {
                      setWithdrawAmount(value);
                    }
                  }}
                  type="number"
                  step="0.000000001"
                  min="0"
                  placeholder={
                    isStake
                      ? "input_$ROGUE_TO_STAKE"
                      : "input_$ROGUE_TO_UNSTAKE"
                  }
                  disabled={loading}
                />
                <Button
                  onClick={() =>
                    isStake
                      ? setDepositAmount(String(balance))
                      : setWithdrawAmount(String(vaultBalanceofUser))
                  }
                >
                  Max
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-end w-full">
              <div>
                <span className="text-[#B6B6B6]"> Available Balance:</span>{" "}
                {balance?.toFixed(5) ?? 0} ROGUE
              </div>
              <div>
                <span className="text-[#B6B6B6]"> Staked Balance:</span>{" "}
                {vaultBalanceofUser.toFixed(5)} ROGUE
              </div>
            </div>
            {/* <div className="text-[#B6B6B6] text-xs uppercase">
                DISCLAIMER: Staking allows you to earn airdrops while supporting
                the project. Please note, there will not be any active yields on
                your deposits. Rest assured, you can withdraw at any time.
              </div> */}
          </div>
        </div>
        <div>



        <div className="flex w-full   justify-center gap-0">
          {wallet.connected ? (
            <>
              {/* <Button
                className="uppercase w-full bg-[#181818] text-[#fff] hover:text-[#fff] hover:bg-[#171717]"
                disabled={loading}
                >
                cancel
                </Button> */}
              <Button
                className="uppercase  px-10 h-auto !font-semibold"
                onClick={isStake ? depositTokens : withdrawTokens}
                disabled={loading}
                >
                <ChevronRight className="w-4 h-4" color="#000" />
                {loading ? "Wait..." : isStake ? "stake" : "unstake"}
              </Button>
            </>
          ) : (
            <div>
              <CustomSolanaButton
                connectText="Connect Wallet"
                disconnectText="Disconnect Wallet"
                buttonStyle="primary"
                size="medium"
                />
            </div>
          )}
        </div>

        <div className="flex justify-end">
        <Button
        variant={"ghost"}
                className="uppercase  px-10 h-auto py-0 !font-semibold"
                onClick={isStake ? depositTokens : withdrawTokens}
                disabled={loading}
              >
                {">> see staking history <<"}
              </Button>
        </div>
        
          </div>
      </div>
    </div>
  );
};

export default StakePopup;
