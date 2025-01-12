const PROGRAM_ID = "8ezh1G1byjQ7waF5v88BXugnAjZfCjn6iikbYfBujemZ";

const IDL: any = {
  version: "0.1.0",
  name: "rogue_staking",
  instructions: [
    {
      name: "initializePlatformConfig",
      accounts: [
        { name: "admin", isMut: true, isSigner: true },
        { name: "mint", isMut: false, isSigner: false },
        { name: "platformConfig", isMut: true, isSigner: false },
        { name: "platformMintTokenAccount", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: "pauseDeposits",
      accounts: [
        { name: "admin", isMut: true, isSigner: true },
        { name: "platformConfig", isMut: true, isSigner: false },
      ],
      args: [],
    },
    {
      name: "pauseWithdrawals",
      accounts: [
        { name: "admin", isMut: true, isSigner: true },
        { name: "platformConfig", isMut: true, isSigner: false },
      ],
      args: [],
    },
    {
      name: "unpauseDeposits",
      accounts: [
        { name: "admin", isMut: true, isSigner: true },
        { name: "platformConfig", isMut: true, isSigner: false },
      ],
      args: [],
    },
    {
      name: "unpauseWithdrawals",
      accounts: [
        { name: "admin", isMut: true, isSigner: true },
        { name: "platformConfig", isMut: true, isSigner: false },
      ],
      args: [],
    },
    {
      name: "deposit",
      accounts: [
        { name: "user", isMut: true, isSigner: true },
        { name: "mint", isMut: false, isSigner: false },
        { name: "platformConfig", isMut: false, isSigner: false },
        { name: "platformMintTokenAccount", isMut: true, isSigner: false },
        { name: "userMintTokenAccount", isMut: true, isSigner: false },
        { name: "depositInfo", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
    {
      name: "withdraw",
      accounts: [
        { name: "user", isMut: true, isSigner: true },
        { name: "mint", isMut: false, isSigner: false },
        { name: "platformConfig", isMut: false, isSigner: false },
        { name: "platformMintTokenAccount", isMut: true, isSigner: false },
        { name: "userMintTokenAccount", isMut: true, isSigner: false },
        { name: "depositInfo", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
  ],
  accounts: [
    {
      name: "DepositInfo",
      type: {
        kind: "struct",
        fields: [
          { name: "user", type: "publicKey" },
          { name: "amount", type: "u64" },
          { name: "lastWithdrawAmount", type: "u64" },
          { name: "lastWithdrawTimestamp", type: "i64" },
          { name: "bump", type: "u8" },
        ],
      },
    },
    {
      name: "PlatformConfig",
      type: {
        kind: "struct",
        fields: [
          { name: "admin", type: "publicKey" },
          { name: "mint", type: "publicKey" },
          { name: "isDepositPaused", type: "bool" },
          { name: "isWithdrawPaused", type: "bool" },
          { name: "bump", type: "u8" },
          { name: "mintTokenAccountBump", type: "u8" },
        ],
      },
    },
  ],
  errors: [
    { code: 6000, name: "ValueZero", msg: "Value zero" },
    { code: 6001, name: "InsufficientDeposit", msg: "Insufficient deposit" },
    { code: 6002, name: "DepositsPaused", msg: "Deposits paused" },
    { code: 6003, name: "WithdrawalsPaused", msg: "Withdrawals paused" },
  ],
};
export const HOST_CONTRACT = { IDL, PROGRAM_ID };
