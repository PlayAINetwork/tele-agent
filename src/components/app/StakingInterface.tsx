import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { FC, useCallback, useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { HOST_CONTRACT } from "@/contracts/host.contract.abi";

const programID = new PublicKey("DKVAPnqZjEQwGBmckw7DH7LhdW9cLCkRqpmVuHiLspnc");

const StakingInterface: FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [userAccount, setUserAccount] = useState<any>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [vaultInfo, setVaultInfo] = useState<any>(null);

  const getProvider = () => {
    if (!wallet.publicKey) throw new Error("Wallet not connected!");
    const provider = new AnchorProvider(
      connection,
      wallet as any,
      AnchorProvider.defaultOptions()
    );
    return provider;
  };

  const getProgram = useCallback(() => {
    const provider = getProvider();
    return new Program(HOST_CONTRACT.IDL, programID, provider);
  }, [wallet.publicKey, connection]);

  // const initializeVault = async () => {
  //   try {
  //     const program = getProgram();

  //     const vaultTokenAccount = new web3.Keypair();

  //     const mint = new PublicKey("46G9LP4Uxt4EeE5pgnexWDXy1vZkt5jwYLJZu6Hm3h7N");

  //     const [vaultPDA] = await PublicKey.findProgramAddress(
  //       [Buffer.from('vault'), wallet.publicKey!.toBuffer()],
  //       program.programId
  //     );

  //     const createTokenAccountIx = SystemProgram.createAccount({
  //       fromPubkey: wallet.publicKey!,
  //       newAccountPubkey: vaultTokenAccount.publicKey,
  //       space: ACCOUNT_SIZE,
  //       lamports: await connection.getMinimumBalanceForRentExemption(ACCOUNT_SIZE),
  //       programId: TOKEN_PROGRAM_ID,
  //     });

  //     const initTokenAccountIx = createInitializeAccountInstruction(
  //       vaultTokenAccount.publicKey,
  //       mint,
  //       wallet.publicKey!,
  //       TOKEN_PROGRAM_ID
  //     );

  //     const tx = await program.methods
  //       .initialize()
  //       .accounts({
  //         vault: vaultPDA,
  //         vaultTokenAccount: vaultTokenAccount.publicKey,
  //         authority: wallet.publicKey!,
  //         systemProgram: web3.SystemProgram.programId,
  //         tokenProgram: TOKEN_PROGRAM_ID,
  //         rent: web3.SYSVAR_RENT_PUBKEY,
  //       })
  //       .preInstructions([createTokenAccountIx, initTokenAccountIx])
  //       .signers([vaultTokenAccount])
  //       .rpc();

  //     console.log('Vault initialized! Transaction:', tx);
  //   } catch (error) {
  //     console.error('Error initializing vault:', error);
  //   }
  // };

  const createUserAccount = async () => {
    try {
      const program = getProgram();

      const [userAccountPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("user"), wallet.publicKey!.toBuffer()],
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

      console.log("User account created!");
      await fetchUserAccount();
    } catch (error) {
      console.error("Error creating user account:", error);
    }
  };

  const deposit = async () => {
    try {
      const program = getProgram();
      const amount = new BN(parseFloat(depositAmount) * 1e9);

      const [vaultPDA, vaultt] = await PublicKey.findProgramAddress(
        [Buffer.from("vault"), wallet.publicKey!.toBuffer()],
        program.programId
      );
      console.log("vaultPDA", vaultPDA.toString(), vaultt);

      const [userAccountPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("user"), wallet.publicKey!.toBuffer()],
        program.programId
      );

      const userTokenAccount = await getAssociatedTokenAddress(
        new PublicKey("46G9LP4Uxt4EeE5pgnexWDXy1vZkt5jwYLJZu6Hm3h7N"),
        wallet.publicKey!
      );
      console.log("userAccountPDA", userAccountPDA.toString());
      console.log("userAccountPDA", userAccountPDA.toString());

      console.log("userTokenAccount", userTokenAccount.toString());
      console.log("userTokenAccount", userTokenAccount);

      const vaultTokenAccount = await getAssociatedTokenAddress(
        new PublicKey("46G9LP4Uxt4EeE5pgnexWDXy1vZkt5jwYLJZu6Hm3h7N"),
        vaultPDA,
        true
      );

      console.log("vaultPDA", vaultPDA.toString());
      console.log("vaultTokenAccount", vaultTokenAccount.toString());

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

      console.log("Deposit successful!");
      await fetchUserAccount();
      await fetchVaultInfo();
    } catch (error) {
      console.error("Error depositing:", error);
    }
  };

  const withdraw = async () => {
    try {
      const program = getProgram();
      const amount = new BN(parseFloat(withdrawAmount) * 1e9);

      const [vaultPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("vault"), wallet.publicKey!.toBuffer()],
        program.programId
      );

      const [userAccountPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("user"), wallet.publicKey!.toBuffer()],
        program.programId
      );

      const userTokenAccount = await getAssociatedTokenAddress(
        new PublicKey("46G9LP4Uxt4EeE5pgnexWDXy1vZkt5jwYLJZu6Hm3h7N"),
        wallet.publicKey!
      );

      const vaultTokenAccount = await getAssociatedTokenAddress(
        new PublicKey("46G9LP4Uxt4EeE5pgnexWDXy1vZkt5jwYLJZu6Hm3h7N"),
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

      console.log("Withdrawal successful!");
      await fetchUserAccount();
      await fetchVaultInfo();
    } catch (error) {
      console.error("Error withdrawing:", error);
    }
  };

  const fetchUserAccount = async () => {
    try {
      const program = getProgram();
      const [userAccountPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("user"), wallet.publicKey!.toBuffer()],
        program.programId
      );

      const account = await program.account.userAccount.fetch(userAccountPDA);
      setUserAccount(account);
    } catch (error) {
      console.error("Error fetching user account:", error);
    }
  };

  const fetchVaultInfo = async () => {
    try {
      const program = getProgram();
      const [vaultPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("vault"), wallet.publicKey!.toBuffer()],
        program.programId
      );

      const vault = await program.account.vault.fetch(vaultPDA);
      setVaultInfo(vault);
    } catch (error) {
      console.error("Error fetching vault info:", error);
    }
  };

  useEffect(() => {
    if (wallet.publicKey) {
      fetchUserAccount();
      fetchVaultInfo();
    }
  }, [wallet.publicKey]);

  if (!wallet.publicKey) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Staking Vault Interface</h1>
      {/* <button
          onClick={initializeVault}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create User Account
        </button> */}
      {!userAccount && (
        <button
          onClick={createUserAccount}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create User Account
        </button>
      )}

      {userAccount && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Your Account</h2>
            <p>
              Deposited Amount:{" "}
              {(userAccount.depositedAmount.toNumber() / 1e9).toFixed(2)}
            </p>
            <p>
              Last Deposit:{" "}
              {new Date(
                userAccount.lastDepositTimestamp * 1000
              ).toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Deposit</h2>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="border p-2 rounded"
              placeholder="Amount to deposit"
            />
            <button
              onClick={deposit}
              className="bg-green-500 text-white px-4 py-2 rounded ml-2"
            >
              Deposit
            </button>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Withdraw</h2>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="border p-2 rounded"
              placeholder="Amount to withdraw"
            />
            <button
              onClick={withdraw}
              className="bg-red-500 text-white px-4 py-2 rounded ml-2"
            >
              Withdraw
            </button>
          </div>

          {vaultInfo && (
            <div>
              <h2 className="text-xl font-semibold">Vault Info</h2>
              <p>
                Total Deposits:{" "}
                {(vaultInfo.totalDeposits.toNumber() / 1e9).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StakingInterface;
