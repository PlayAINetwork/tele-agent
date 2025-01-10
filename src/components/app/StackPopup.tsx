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
import CustomSolanaButton from "../WalletConnect/solConnectBtn";
import { useToast } from "@/hooks/use-toast";
import { HOST_CONTRACT } from "@/contracts/host.contract.abi";

const TOKEN_MINT = new PublicKey(
  "29bX2GaJFbtNtfRvsedGDVvyPMQKhc5AbkZYo5RYW5Lq"
);
const programID = new PublicKey(HOST_CONTRACT.PROGRAM_ID);
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
  const [vaultBalanceofUser, setVaultBalanceofUser] = useState(0);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState(null);
  const fetchBalance = async (wallet: any) => {
    try {
      setLoading(true);
      const connection = new Connection(import.meta.env.VITE_SOL_RPC_DEV);
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
  useEffect(() => {
    if (wallet?.publicKey) {
      fetchBalance(wallet);
    }
  }, [wallet?.publicKey, isStake, balance, error]);

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
      // Derive PDA for user balance account
      const [userBalancePDA] = await PublicKey.findProgramAddress(
        [Buffer.from("user_balance"), wallet.publicKey.toBuffer()],
        programID
      );

      // Get the provider
      const provider = getProvider();

      // Fetch the account info
      const accountInfo =
        await provider.connection.getAccountInfo(userBalancePDA);

      // If account doesn't exist, return 0 balance
      if (!accountInfo) {
        setVaultBalanceofUser(0);
        return 0;
      }

      // Parse the account data according to the UserBalance account structure
      // UserBalance struct has: 8 bytes for discriminator + 32 bytes for owner + 8 bytes for balance
      const balance = accountInfo.data.slice(40, 48); // Get the last 8 bytes containing balance

      // Convert the balance bytes to BigInt (u64)
      const userBalance = Buffer.from(balance).readBigUInt64LE();
      const formatted_balance = Number(userBalance) / Math.pow(10, 9);
      setVaultBalanceofUser(formatted_balance);
      return formatted_balance;
    } catch (error) {
      console.error("Error fetching user balance:", error);
      throw error;
    }
  };

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
        console.log(tokenAccount.value.uiAmount);
        getUserBalance(wallet);
      }
    } catch (error) {
      console.error("Error checking vault initialization:", error);
      setIsVaultInitialized(false);
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
  const getVault = async () => {
    const program = getProgram();
    const [vaultData] = await PublicKey.findProgramAddress(
      [Buffer.from("vault_data")],
      program.programId
    );
    console.log("vault data", vaultData);
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
      const [userBalance] = await PublicKey.findProgramAddress(
        [Buffer.from("user_balance"), wallet.publicKey.toBuffer()],
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
          userBalance: userBalance,
        })
        .rpc();

      await checkVaultInitialization();
      await fetchBalance(wallet);
      setDepositAmount("");
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
    const balance = await getUserBalance(wallet);
    if (!validateTransaction(withdrawAmount, balance)) return;
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
      const [userBalance] = await PublicKey.findProgramAddress(
        [Buffer.from("user_balance"), wallet.publicKey.toBuffer()],
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
          userBalance: userBalance,
        })
        .rpc();

      await checkVaultInitialization();
      await fetchBalance(wallet);
      setWithdrawAmount("");
      setVaultBalanceofUser(Number(balance));
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
  useEffect(() => {
    getVault();
  }, []);
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
            onClick={async () => {
              setStake(false);
              getUserBalance(wallet);
            }}
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
                      Available Balance: {balance?.toFixed(5) ?? 0} ROGUE
                    </div>
                  ) : (
                    <div>
                      Staked Balance: {vaultBalanceofUser.toFixed(5)} ROGUE
                    </div>
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
                      !isVaultInitialized
                        ? "Please Initialize vault first!"
                        : isStake
                          ? "input_$ROGUE_TO_STAKE"
                          : "input_$ROGUE_TO_UNSTAKE"
                    }
                    disabled={loading || !isVaultInitialized}
                  />
                </div>
              </div>
              {/* <div className="text-[#B6B6B6]">DISCLAIMER: ONCE STAKED, t</div> */}
            </div>
          </div>

          <div className="flex w-full gap-0">
            {wallet.connected ? (
              <>
                {isVaultInitialized ? (
                  <Button
                    className="uppercase w-full bg-[#181818] text-[#fff] hover:text-[#fff] hover:bg-[#171717]"
                    disabled={loading}
                  >
                    cancel
                  </Button>
                ) : null}

                {isVaultInitialized ? (
                  <Button
                    className="uppercase w-full"
                    onClick={isStake ? depositTokens : withdrawTokens}
                    disabled={loading || !isVaultInitialized}
                  >
                    <ChevronRight className="w-4 h-4" color="#000" />
                    {loading ? "Wait..." : isStake ? "stake" : "unstake"}
                  </Button>
                ) : (
                  <Button
                    className="uppercase w-full"
                    // className="uppercase w-full bg-[#181818] text-[#fff] hover:text-[#fff] hover:bg-[#171717]"
                    onClick={initializeVault}
                    disabled={loading}
                  >
                    {loading ? "Initializing..." : "initialize vault"}
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
