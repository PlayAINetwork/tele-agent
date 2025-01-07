import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import { ChevronRight, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTokenBalance } from "@/hooks/token/useGetTokenBalance";
import { useCallback, useEffect, useState } from "react";
import {
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, BN, web3 } from "@project-serum/anchor";

import {
  ACCOUNT_SIZE,
  createInitializeAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
// import StakingInterface from "./StakingInterface";
import { IDL } from "./staking_vault";

// const TOKEN_MINT = new PublicKey(
//   "46G9LP4Uxt4EeE5pgnexWDXy1vZkt5jwYLJZu6Hm3h7N"
// );

const programID = new PublicKey('6MZWCa95kXiV77ohT2c7Q7rFyftRF8pyAxFa1GMPJQMU');


const StackPopup = () => {
  // const wallet :any= useWallet();
  const wallet: any = useWallet();
  const { balance } = useTokenBalance(wallet?.publicKey);
  const [isStake, setStake] = useState(true);
  // const [amount, setAmount] = useState("");
  const { connection } = useConnection();
  const [userAccount, setUserAccount] = useState<any>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [vaultInfo, setVaultInfo] = useState<any>(null);

const showIn =true
   const getProvider = () => {
      if (!wallet.publicKey) throw new Error('Wallet not connected!');
      const provider = new AnchorProvider(
        connection,
        wallet as any,
        AnchorProvider.defaultOptions()
      );
      return provider;
    };
  
    const getProgram = useCallback(() => {
      const provider = getProvider();
      return new Program(IDL, programID, provider);
    }, [wallet.publicKey, connection]);
  
    const initializeVault = async () => {
      try {
        const program = getProgram();
       
        const vaultTokenAccount = new web3.Keypair();

        // Convert the Keypair to JSON format
const vaultTokenAccountJSON = {
  publicKey: vaultTokenAccount.publicKey.toBase58(),
  secretKey: Array.from(vaultTokenAccount.secretKey), // Converts Uint8Array to a plain array
};

// Log or save the JSON
console.log(JSON.stringify(vaultTokenAccountJSON, null, 2));
       
        const mint = new PublicKey("46G9LP4Uxt4EeE5pgnexWDXy1vZkt5jwYLJZu6Hm3h7N");
       
        const [vaultPDA] = await PublicKey.findProgramAddress(
          [Buffer.from('vault'), wallet.publicKey!.toBuffer()],
          program.programId
        );
    
        const createTokenAccountIx = SystemProgram.createAccount({
          fromPubkey: wallet.publicKey!,
          newAccountPubkey: vaultTokenAccount.publicKey,
          space: ACCOUNT_SIZE,
          lamports: await connection.getMinimumBalanceForRentExemption(ACCOUNT_SIZE),
          programId: TOKEN_PROGRAM_ID,
        });
    
        const initTokenAccountIx = createInitializeAccountInstruction(
          vaultTokenAccount.publicKey,
          mint,
          wallet.publicKey!,
          TOKEN_PROGRAM_ID
        );
    
        const tx = await program.methods
          .initialize()
          .accounts({
            vault: vaultPDA,
            vaultTokenAccount: vaultTokenAccount.publicKey,
            authority: wallet.publicKey!,
            systemProgram: web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: web3.SYSVAR_RENT_PUBKEY,
          })
          .preInstructions([createTokenAccountIx, initTokenAccountIx])
          .signers([vaultTokenAccount])
          .rpc();
    
        console.log('Vault initialized! Transaction:', tx);
      } catch (error) {
        console.error('Error initializing vault:', error);
      }
    };
  
    const createUserAccount = async () => {
      try {
        const program = getProgram();
        
        const [userAccountPDA] = await PublicKey.findProgramAddress(
          [Buffer.from('user'), wallet.publicKey!.toBuffer()],
          program.programId
        );
  
        await program.methods
          .createUserAccount()
          .accounts({
            userAccount: userAccountPDA,
            userAuthority: wallet.publicKey!,
            systemProgram: web3.SystemProgram.programId,
            rent: web3.SYSVAR_RENT_PUBKEY,
          })
          .rpc();
  
        console.log('User account created!');
        await fetchUserAccount();
      } catch (error) {
        console.error('Error creating user account:', error);
      }
    };
  
    const deposit = async () => {
      try {
        const program = getProgram();
        const amount = new BN(parseFloat(depositAmount) * 1e9);
  
        const [vaultPDA] = await PublicKey.findProgramAddress(
          [Buffer.from('vault'), wallet.publicKey!.toBuffer()],
          program.programId
        );
        console.log("vaultPDA",vaultPDA.toString())
  
        const [userAccountPDA] = await PublicKey.findProgramAddress(
          [Buffer.from('user'), wallet.publicKey!.toBuffer()],
          program.programId
        );
  
        const userTokenAccount = await getAssociatedTokenAddress(
          new PublicKey('46G9LP4Uxt4EeE5pgnexWDXy1vZkt5jwYLJZu6Hm3h7N'),
          wallet.publicKey!
        );
        console.log("userAccountPDA",userAccountPDA.toString())
        console.log("userAccountPDA",userAccountPDA.toString())
  
        console.log("userTokenAccount",userTokenAccount.toString())
        console.log("userTokenAccount",userTokenAccount)
  
  
        const vaultTokenAccount = await getAssociatedTokenAddress(
          new PublicKey('46G9LP4Uxt4EeE5pgnexWDXy1vZkt5jwYLJZu6Hm3h7N'),
          vaultPDA,
          true
        );
  
        console.log("vaultPDA",vaultPDA.toString())
        console.log("vaultTokenAccount",vaultTokenAccount.toString())
  
  
        await program.methods
          .deposit(amount)
          .accounts({
            vault: vaultPDA,
            userAccount: userAccountPDA,
            vaultTokenAccount,
            userTokenAccount,
            userAuthority: wallet.publicKey!,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();
  
        console.log('Deposit successful!');
        await fetchUserAccount();
        await fetchVaultInfo();
      } catch (error) {
        console.error('Error depositing:', error);
      }
    };
  
    const withdraw = async () => {
      try {
        const program = getProgram();
        const amount = new BN(parseFloat(withdrawAmount) * 1e9); 
  
        const [vaultPDA] = await PublicKey.findProgramAddress(
          [Buffer.from('vault'), wallet.publicKey!.toBuffer()],
          program.programId
        );
  
        const [userAccountPDA] = await PublicKey.findProgramAddress(
          [Buffer.from('user'), wallet.publicKey!.toBuffer()],
          program.programId
        );
  
        const userTokenAccount = await getAssociatedTokenAddress(
          new PublicKey('46G9LP4Uxt4EeE5pgnexWDXy1vZkt5jwYLJZu6Hm3h7N'), 
          wallet.publicKey!
        );
  
        const vaultTokenAccount = await getAssociatedTokenAddress(
          new PublicKey('46G9LP4Uxt4EeE5pgnexWDXy1vZkt5jwYLJZu6Hm3h7N'), 
          vaultPDA,
          true
        );
  
        await program.methods
          .withdraw(amount)
          .accounts({
            vault: vaultPDA,
            userAccount: userAccountPDA,
            vaultTokenAccount,
            userTokenAccount,
            userAuthority: wallet.publicKey!,
            authority: wallet.publicKey!,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();
  
        console.log('Withdrawal successful!');
        await fetchUserAccount();
        await fetchVaultInfo();
      } catch (error) {
        console.error('Error withdrawing:', error);
      }
    };
  
    const fetchUserAccount = async () => {
      try {
        const program = getProgram();
        const [userAccountPDA] = await PublicKey.findProgramAddress(
          [Buffer.from('user'), wallet.publicKey!.toBuffer()],
          program.programId
        );
  
        const account = await program.account.userAccount.fetch(userAccountPDA);
        setUserAccount(account);
      } catch (error) {
        console.error('Error fetching user account:', error);
      }
    };
  
    const fetchVaultInfo = async () => {
      try {
        const program = getProgram();
        const [vaultPDA] = await PublicKey.findProgramAddress(
          [Buffer.from('vault'), wallet.publicKey!.toBuffer()],
          program.programId
        );
  
        const vault = await program.account.vault.fetch(vaultPDA);
        setVaultInfo(vault);
      } catch (error) {
        console.error('Error fetching vault info:', error);
      }
    };
  
    useEffect(() => {
      if (wallet.publicKey) {
        fetchUserAccount();
        fetchVaultInfo();
      }
    }, [wallet.publicKey]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="px-12 w-full h-full cursor-pointer bg-neutral-700 flex justify-center items-center overflow-hidden"
          style={{
            clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        >
          <span className="text-white relative transition-transform duration-300 ease-in-out">
            <span
              className={`block transition-all duration-300 ${"opacity-100 translate-y-0"}`}
            >
              {"> stake now <"}
            </span>
            <span
              className={`block absolute text-nowrap top-0 left-0  transition-all duration-300 ${"opacity-0 -translate-y-full"}`}
            >
              {"> stake now <"}
            </span>
          </span>
        </div>
      </DialogTrigger>

      <DialogContent
        className={` flex flex-col sm:max-w-md md:max-w-[500px] gap-0  border-2 border-primary binaria bg-[#181818] p-0 pt-0 overflow-auto `}
      >
        {/* <StakingInterface/> */}
        <div className="flex justify-between">
          <DialogDescription
            onClick={() => setStake(true)}
            className={` px-4 w-full uppercase text-md text-gray-200 py-2  cursor-pointer  ${isStake ? "bg-primary text-[#010101] " : "bg-[#181818] text-[#fff]"} `}
          >
            {">> stake_$rogue"}
          </DialogDescription>
          <DialogDescription
            onClick={() => setStake(false)}
            className={`px-4 w-full uppercase text-md text-gray-200 py-2   cursor-pointer  ${isStake ? "bg-[#181818] text-[#fff]" : "bg-primary text-[#010101]"} `}
          >
            {">> UNSTAKE_$rogue"}
          </DialogDescription>
          <DialogClose className="min-w-[40px] flex justify-center items-center bg-primary z-10">
            <X className="text-black" />
          </DialogClose>
        </div>
        <div className=" flex-1 h-full overflow-auto w-full">
         
          <div className="flex flex-col  h-full py-6 px-6   w-full border-primary border-[1px]  justify-center items-center gap-4     bg-[#131314] ">
            <div className="flex gap-3  w-full flex-wrap">
              <div className="flex w-full flex-col gap-2 text-[#F1F6F2]">
                {isStake ? (
                  <div className="flex w-full  ">
                    <div>ROGUE Balance: {balance ?? 0}</div>
                  </div>
                ) : (
                  <div className="flex w-full  ">
                    <div>ROGUE staked Balance: {balance ?? 0}</div>
                  </div>
                )}
                  {vaultInfo && (
            <div>
              <h2 className="text-xl font-semibold">Vault Info</h2>
              <p>Total Deposits: {(vaultInfo.totalDeposits.toNumber() / 1e9).toFixed(2)}</p>
            </div>
          )}

                <div className="flex w-full  border-[1px] border-primary">
                  <Input
                    className="pr-[40px] min-w-full binaria border-none  uppercase hover:bg-[#303030]"
                    value={isStake ?depositAmount: withdrawAmount}
                    onChange={(e) => isStake ?setDepositAmount(e.target.value): setWithdrawAmount(e.target.value)}
                    type="text"
                    placeholder={
                      isStake
                        ? "input_$ROGUE_TO_STAKE"
                        : "input_$ROGUE_TO_UNSTAKE"
                    }
                    //   disabled={disableAction}
                    // onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="flex w-full text-[#B6B6B6]">
                  <div>DISCLAIMER: ONCE STAKED, t</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full gap-0  ">
            <Button
              className=" uppercase w-full bg-[#181818] text-[#fff] hover:text-[#fff] hover:bg-[#171717]"
              //   onClick={transferTokens}
              //   disabled={videoGeneraing || !connected || disableAction}
            >
              cancel
            </Button>
            {
              showIn &&
            <Button
              className=" uppercase w-full bg-[#181818] text-[#fff] hover:text-[#fff] hover:bg-[#171717]"
              onClick={initializeVault}
              //   disabled={videoGeneraing || !connected || disableAction}
            >
              initializeVault
            </Button>
            }

            {!userAccount ?(
            <Button
              className=" uppercase w-full bg-[#181818] text-[#fff] hover:text-[#fff] hover:bg-[#171717]"
              onClick={createUserAccount}
              //   disabled={videoGeneraing || !connected || disableAction}
            >
              createUserAccount
            </Button>)
            :  ( <Button
            className=" uppercase w-full "
            onClick={isStake ? deposit : withdraw}
            //   disabled={videoGeneraing || !connected || disableAction}
          >
            <ChevronRight className="w-4 h-4" color="#000" />
            {isStake ? "stake" : "unstake"}
          </Button>
)}

         
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StackPopup;
