// // Client

// const wsolMint = new anchor.web3.PublicKey(
//   "29bX2GaJFbtNtfRvsedGDVvyPMQKhc5AbkZYo5RYW5Lq" //replace with rouge while going mainnet
// );
// const seeds = {
//   platformConfig: "platform_config",
//   platformMintTokenAccount: "platform_mint_token_account",
//   depositInfo: "deposit_info",
// };
// const pda = {
//   getPlatformConfig() {
//     return anchor.web3.PublicKey.findProgramAddressSync(
//       [Buffer.from(seeds.platformConfig)],
//       pg.program.programId
//     )[0];
//   },
//   getPlatformMintTokenAccount() {
//     return anchor.web3.PublicKey.findProgramAddressSync(
//       [Buffer.from(seeds.platformMintTokenAccount)],
//       pg.program.programId
//     )[0];
//   },
//   getDepositInfo(user) {
//     return anchor.web3.PublicKey.findProgramAddressSync(
//       [Buffer.from(seeds.depositInfo), user.toBuffer()],
//       pg.program.programId
//     )[0];
//   },
// };

// const initializePlatformConfig = async () => {
//   const platformConfig = pda.getPlatformConfig();
//   const platformMintTokenAccount = pda.getPlatformMintTokenAccount();

//   console.log("Initializing program...\n");

//   // await pg.program.methods
//   //   .initializePlatformConfig()
//   //   .accounts({
//   //     admin: pg.wallet.publicKey,
//   //     platformConfig,
//   //     mint: wsolMint,
//   //     platformMintTokenAccount,
//   //   })
//   //   .rpc();

//   const platformConfigAccount =
//     await pg.program.account.platformConfig.fetch(platformConfig);

//   console.log("Program initialized successfully...");
//   console.log("Platform admin: ", platformConfigAccount.admin.toString());
//   console.log("Staking token: ", platformConfigAccount.mint.toString());
// };

// initializePlatformConfig();
