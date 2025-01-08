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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import { ChevronRight, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// import { useTokenBalance } from "@/hooks/token/useGetTokenBalance";
import { IDL } from "./staking_vault";
import CustomSolanaButton from "../WalletConnect/solConnectBtn";
import { useToast } from "@/hooks/use-toast";

const TOKEN_MINT = new PublicKey(
  "29bX2GaJFbtNtfRvsedGDVvyPMQKhc5AbkZYo5RYW5Lq"
);
const programID = new PublicKey("EFpMgUffZPsUXYf4XEADJ3c4h96GDjhiuLGNE7caLwxB");
const tokenDecimals = 9;

const StakePopup = () => {
  const wallet: any = useWallet();
  const { connection } = useConnection();
  // const { balance } = useTokenBalance(wallet?.publicKey);
  const { toast } = useToast();

  const [isStake, setStake] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isVaultInitialized, setIsVaultInitialized] = useState(false);
  const [vaultBalance, setVaultBalance] = useState(0);
  const [mybalance, setMybalance] = useState();
  const [balance, setBalance] = useState<any>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const connection = new Connection(import.meta.env.VITE_SOL_RPC);
        const publicKey = new PublicKey(wallet?.publicKey);
        // const TOKEN_ADDRESS = import.meta.env.VITE_SPL_TOKEN_ADDRESS;
        const TOKEN_ADDRESS = "29bX2GaJFbtNtfRvsedGDVvyPMQKhc5AbkZYo5RYW5Lq";
        const tokenPublicKey = new PublicKey(TOKEN_ADDRESS);

        const associatedAddress = await getAssociatedTokenAddress(
          tokenPublicKey,
          publicKey
        );
        const account = await getAccount(connection, associatedAddress);

        setBalance(Number(account.amount) / 10 ** 9);
      } catch (err: any) {
        console.log(err);
        setError(err.message);

      } finally {
        setLoading(false);
      }
    };

    if (wallet?.publicKey) {
      fetchBalance();
    }
  }, [wallet?.publicKey, isStake, mybalance,error]);

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
    return new Program(IDL, programID, provider);
  }, [wallet.publicKey, connection]);

  const checkVaultInitialization = async () => {
    try {
      const program = getProgram();
      const [vaultTokenAccount] = await PublicKey.findProgramAddress(
        [Buffer.from("token_vault"), TOKEN_MINT.toBuffer()],
        program.programId
      );

      const accountInfo = await connection.getAccountInfo(vaultTokenAccount);
      setIsVaultInitialized(accountInfo !== null);

      if (accountInfo !== null) {
        const tokenAccount =
          await connection.getTokenAccountBalance(vaultTokenAccount);
        setVaultBalance(tokenAccount.value.uiAmount || 0);
      }
    } catch (error) {
      console.error("Error checking vault initialization:", error);
      setIsVaultInitialized(false);
    }
  };

  const validateTransaction = (amount: any) => {
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

    if (!isStake && parseFloat(amount) > vaultBalance) {
      toast({
        title: "Insufficient staked balance",
      });
      return false;
    }

    return true;
  };

  const initializeVault = async () => {
    setLoading(true);
    try {
      const program = getProgram();

      const [vaultData] = await PublicKey.findProgramAddress(
        [Buffer.from("vault_data")],
        program.programId
      );

      const [tokenAccountOwnerPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("token_account_owner_pda")],
        program.programId
      );

      const [vaultTokenAccount] = await PublicKey.findProgramAddress(
        [Buffer.from("token_vault"), TOKEN_MINT.toBuffer()],
        program.programId
      );

      await program.methods
        .initialize()
        .accounts({
          payer: wallet.publicKey,
          vaultData: vaultData,
          tokenAccountOwnerPda: tokenAccountOwnerPDA,
          vaultTokenAccount: vaultTokenAccount,
          mintOfTokenBeingSent: TOKEN_MINT,
          signer: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([])
        .rpc();

      await checkVaultInitialization();
      toast({
        title: "Initiated Successfully ",
      });
    } catch (error) {
      console.error("Error initializing vault:", error);
      toast({
        title:
          "Failed to initialize vault. Please check if you have enough SOL for transaction fees. ",
      });
    } finally {
      setLoading(false);
    }
  };

  const depositTokens = async () => {
    if (!validateTransaction(depositAmount)) return;

    setLoading(true);
    try {
      const program = getProgram();
      const userATA = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet.publicKey,
        TOKEN_MINT,
        wallet.publicKey
      );

      const [tokenAccountOwnerPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("token_account_owner_pda")],
        program.programId
      );

      const [vaultTokenAccount] = await PublicKey.findProgramAddress(
        [Buffer.from("token_vault"), TOKEN_MINT.toBuffer()],
        program.programId
      );
      const [vaultData] = await PublicKey.findProgramAddress(
        [Buffer.from("vault_data")],
        program.programId
      );

      await program.methods
        .transferIn(new BN(parseFloat(depositAmount) * 10 ** tokenDecimals))
        .accounts({
          tokenAccountOwnerPda: tokenAccountOwnerPDA,
          vaultData: vaultData,
          vaultTokenAccount: vaultTokenAccount,
          senderTokenAccount: userATA.address,
          mintOfTokenBeingSent: TOKEN_MINT,
          signer: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      await checkVaultInitialization();
      setDepositAmount("");
      setMybalance(balance);
      toast({
        title: "Deposited Successfully ",
      });
    } catch (error) {
      console.error("Error depositing tokens:", error);
      toast({
        title: "Failed to deposit tokens ",
      });
    } finally {
      setLoading(false);
    }
  };

  const withdrawTokens = async () => {
    if (!validateTransaction(withdrawAmount)) return;

    setLoading(true);
    try {
      const program = getProgram();
      const userATA = await getAssociatedTokenAddress(
        TOKEN_MINT,
        wallet.publicKey
      );

      const [tokenAccountOwnerPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("token_account_owner_pda")],
        program.programId
      );

      const [vaultTokenAccount] = await PublicKey.findProgramAddress(
        [Buffer.from("token_vault"), TOKEN_MINT.toBuffer()],
        program.programId
      );
      const [vaultData] = await PublicKey.findProgramAddress(
        [Buffer.from("vault_data")],
        program.programId
      );
      await program.methods
        .transferOut(new BN(parseFloat(withdrawAmount) * 10 ** tokenDecimals))
        .accounts({
          tokenAccountOwnerPda: tokenAccountOwnerPDA,
          vaultTokenAccount: vaultTokenAccount,
          vaultData: vaultData,
          senderTokenAccount: userATA,
          mintOfTokenBeingSent: TOKEN_MINT,
          signer: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      await checkVaultInitialization();
      setWithdrawAmount("");
      toast({
        title: "Success to withdraw tokens",
      });
    } catch (error) {
      console.error("Error withdrawing tokens:", error);
      toast({
        title: "Failed to withdraw tokens ",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.publicKey) {
      checkVaultInitialization();
    }
  }, [wallet.publicKey, connection]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="px-12 w-full h-full cursor-pointer bg-neutral-700 flex justify-center items-center overflow-hidden"
          style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}
        >
          <span className="text-white relative transition-transform duration-300 ease-in-out">
            <span className="block transition-all duration-300 opacity-100 translate-y-0">
              {"> stake now <"}
            </span>
          </span>
        </div>
      </DialogTrigger>

      <DialogContent className="flex flex-col sm:max-w-md md:max-w-[500px] gap-0 border-2 border-primary binaria bg-[#181818] p-0 pt-0 overflow-auto">
        <div className="flex justify-between">
          <DialogDescription
            onClick={() => setStake(true)}
            className={`px-4 w-full uppercase text-md text-gray-200 py-2 cursor-pointer ${
              isStake ? "bg-primary text-[#010101]" : "bg-[#181818] text-[#fff]"
            }`}
          >
            {">> stake_$rogue"}
          </DialogDescription>
          <DialogDescription
            onClick={() => setStake(false)}
            className={`px-4 w-full uppercase text-md text-gray-200 py-2 cursor-pointer ${
              isStake ? "bg-[#181818] text-[#fff]" : "bg-primary text-[#010101]"
            }`}
          >
            {">> unstake_$rogue"}
          </DialogDescription>
          <DialogClose className="min-w-[40px] flex justify-center items-center bg-primary z-10">
            <X className="text-black" />
          </DialogClose>
        </div>

        <div className="flex-1 h-full overflow-auto w-full">
          <div className="flex flex-col h-full py-6 px-6 w-full border-primary border-[1px] justify-center items-center gap-4 bg-[#131314]">
            <div className="flex gap-3 w-full flex-wrap">
              <div className="flex w-full flex-col gap-2 text-[#F1F6F2]">
                {/* {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                 */}
                <div className="flex w-full justify-between">
                  {isStake ? (
                    <div>
                      Available Balance: {balance?.toFixed(2) ?? 0} ROGUE
                    </div>
                  ) : (
                    <div>Staked Balance: {vaultBalance.toFixed(2)} ROGUE</div>
                  )}
                </div>

                <div className="flex w-full border-[1px] border-primary">
                  <Input
                    className="pr-[40px] min-w-full binaria border-none uppercase hover:bg-[#303030]"
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
                </div>
              </div>
              <div className="text-[#B6B6B6]">DISCLAIMER: ONCE STAKED, t</div>
            </div>
          </div>

          <div className="flex w-full gap-0">
            {wallet.connected ? (
              <>
                <Button
                  className="uppercase w-full bg-[#181818] text-[#fff] hover:text-[#fff] hover:bg-[#171717]"
                  disabled={loading}
                >
                  cancel
                </Button>

                {isVaultInitialized ? (
                  <Button
                    className="uppercase w-full"
                    onClick={isStake ? depositTokens : withdrawTokens}
                    disabled={loading || !isVaultInitialized}
                  >
                    <ChevronRight className="w-4 h-4" color="#000" />
                    {isStake ? "stake" : "unstake"}
                  </Button>
                ) : (
                  <Button
                    className="uppercase w-full"
                    // className="uppercase w-full bg-[#181818] text-[#fff] hover:text-[#fff] hover:bg-[#171717]"
                    onClick={initializeVault}
                    disabled={loading}
                  >
                    initialize vault
                  </Button>
                )}
              </>
            ) : (
              <>
                <CustomSolanaButton
                  connectText="Connect Wallet"
                  disconnectText="Disconnect Wallet"
                  buttonStyle="primary"
                  size="medium"
                />
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StakePopup;
