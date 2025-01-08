export const IDL: any = {
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
      name: "transferIn",
      accounts: [
        { name: "vaultData", isMut: true, isSigner: false },
        { name: "tokenAccountOwnerPda", isMut: false, isSigner: false },
        { name: "vaultTokenAccount", isMut: true, isSigner: false },
        { name: "senderTokenAccount", isMut: true, isSigner: false },
        { name: "mintOfTokenBeingSent", isMut: false, isSigner: false },
        { name: "signer", isMut: false, isSigner: true },
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
        { name: "tokenAccountOwnerPda", isMut: false, isSigner: false },
        { name: "vaultTokenAccount", isMut: true, isSigner: false },
        { name: "senderTokenAccount", isMut: true, isSigner: false },
        { name: "mintOfTokenBeingSent", isMut: false, isSigner: false },
        { name: "signer", isMut: false, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "rent", isMut: false, isSigner: false },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
  ],
  accounts: [
    {
      name: "VaultData",
      type: {
        kind: "struct",
        fields: [
          { name: "userBalances", type: { vec: { defined: "UserBalance" } } },
        ],
      },
    },
  ],
  types: [
    {
      name: "UserBalance",
      type: {
        kind: "struct",
        fields: [
          { name: "user", type: "publicKey" },
          { name: "amount", type: "u64" },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InsufficientBalance",
      msg: "Insufficient balance for withdrawal",
    },
  ],
};
