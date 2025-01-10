const PROGRAM_ID = "Dghbe2RAYG2L6oKNg8ASZPQzCR2sz5srofE32iwtoDMs";

const IDL: any = {
  version: "0.1.0",
  name: "token_vault",
  instructions: [
    {
      name: "initialize",
      accounts: [
        { name: "payer", isMut: true, isSigner: true },
        { name: "vaultData", isMut: true, isSigner: false },
        { name: "tokenAccountOwnerPda", isMut: false, isSigner: false },
        { name: "vaultTokenAccount", isMut: true, isSigner: false },
        { name: "mintOfTokenBeingSent", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "rent", isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: "pause",
      accounts: [
        { name: "vaultData", isMut: true, isSigner: false },
        { name: "admin", isMut: false, isSigner: true },
      ],
      args: [],
    },
    {
      name: "unpause",
      accounts: [
        { name: "vaultData", isMut: true, isSigner: false },
        { name: "admin", isMut: false, isSigner: true },
      ],
      args: [],
    },
    {
      name: "transferIn",
      accounts: [
        { name: "vaultData", isMut: true, isSigner: false },
        { name: "userBalance", isMut: true, isSigner: false },
        { name: "tokenAccountOwnerPda", isMut: false, isSigner: false },
        { name: "vaultTokenAccount", isMut: true, isSigner: false },
        { name: "senderTokenAccount", isMut: true, isSigner: false },
        { name: "mintOfTokenBeingSent", isMut: false, isSigner: false },
        { name: "signer", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "rent", isMut: false, isSigner: false },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
    {
      name: "transferOut",
      accounts: [
        { name: "vaultData", isMut: true, isSigner: false },
        { name: "userBalance", isMut: true, isSigner: false },
        { name: "tokenAccountOwnerPda", isMut: false, isSigner: false },
        { name: "vaultTokenAccount", isMut: true, isSigner: false },
        { name: "senderTokenAccount", isMut: true, isSigner: false },
        { name: "mintOfTokenBeingSent", isMut: false, isSigner: false },
        { name: "signer", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "rent", isMut: false, isSigner: false },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
    {
      name: "getUserBalance",
      accounts: [
        { name: "userBalance", isMut: false, isSigner: false },
        { name: "owner", isMut: false, isSigner: false },
      ],
      args: [],
      returns: "u64",
    },
  ],
  accounts: [
    {
      name: "VaultData",
      type: {
        kind: "struct",
        fields: [
          { name: "paused", type: "bool" },
          { name: "admin", type: "publicKey" },
          { name: "totalUsers", type: "u32" },
        ],
      },
    },
    {
      name: "UserBalance",
      type: {
        kind: "struct",
        fields: [
          { name: "owner", type: "publicKey" },
          { name: "balance", type: "u64" },
        ],
      },
    },
  ],
  types: [
    {
      name: "TransferType",
      type: {
        kind: "enum",
        variants: [{ name: "Deposit" }, { name: "Withdrawal" }],
      },
    },
  ],
  events: [
    {
      name: "TransferEvent",
      fields: [
        { name: "user", type: "publicKey", index: false },
        { name: "amount", type: "u64", index: false },
        {
          name: "transferType",
          type: { defined: "TransferType" },
          index: false,
        },
        { name: "timestamp", type: "i64", index: false },
        { name: "tokenMint", type: "publicKey", index: false },
        { name: "vaultBalance", type: "u64", index: false },
        { name: "userBalance", type: "u64", index: false },
      ],
    },
    {
      name: "InitializeEvent",
      fields: [
        { name: "vault", type: "publicKey", index: false },
        { name: "admin", type: "publicKey", index: false },
      ],
    },
    {
      name: "PauseEvent",
      fields: [
        { name: "paused", type: "bool", index: false },
        { name: "admin", type: "publicKey", index: false },
        { name: "timestamp", type: "i64", index: false },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InsufficientBalance",
      msg: "Insufficient balance for withdrawal",
    },
    { code: 6001, name: "InvalidAmount", msg: "Invalid amount" },
    { code: 6002, name: "InvalidOwner", msg: "Invalid token account owner" },
    {
      code: 6003,
      name: "InsufficientVaultBalance",
      msg: "Insufficient vault balance",
    },
    { code: 6004, name: "UnauthorizedDeployer", msg: "Unauthorized deployer" },
    { code: 6005, name: "VaultPaused", msg: "Vault is paused" },
    { code: 6006, name: "UnauthorizedAdmin", msg: "Unauthorized admin" },
    { code: 6007, name: "AlreadyPaused", msg: "Vault is already paused" },
    { code: 6008, name: "NotPaused", msg: "Vault is not paused" },
    { code: 6009, name: "CalculationOverflow", msg: "Calculation overflow" },
  ],
};
export const HOST_CONTRACT = { IDL, PROGRAM_ID };
