const PROGRAM_ID = "79zL3sFzMF6GZjM2AgMuDa2BrVVofShrSosrXcRRLykf";

const IDL: any = {
  version: "0.1.0",
  name: "rogue_staking",
  instructions: [
    {
      name: "initializePlatformConfig",
      docs: [
        "Initializes the platform config, setting the admin, and the mint to accept for deposits.",
      ],
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
          docs: ["The platform admin."],
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
          docs: ["The token to be used for staking."],
        },
        {
          name: "platformConfig",
          isMut: true,
          isSigner: false,
          docs: ["The global platform config."],
        },
        {
          name: "platformMintTokenAccount",
          isMut: true,
          isSigner: false,
          docs: ["Vault to store deposited tokens."],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "pauseDeposits",
      docs: ["Pauses deposits."],
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
          docs: ["The platform admin."],
        },
        {
          name: "platformConfig",
          isMut: true,
          isSigner: false,
          docs: ["The global platform config."],
        },
      ],
      args: [],
    },
    {
      name: "pauseWithdrawals",
      docs: ["Pauses withdrawals."],
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
          docs: ["The platform admin."],
        },
        {
          name: "platformConfig",
          isMut: true,
          isSigner: false,
          docs: ["The global platform config."],
        },
      ],
      args: [],
    },
    {
      name: "unpauseDeposits",
      docs: ["UnPauses deposits."],
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
          docs: ["The platform admin."],
        },
        {
          name: "platformConfig",
          isMut: true,
          isSigner: false,
          docs: ["The global platform config."],
        },
      ],
      args: [],
    },
    {
      name: "unpauseWithdrawals",
      docs: ["UnPauses withdrawals."],
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
          docs: ["The platform admin."],
        },
        {
          name: "platformConfig",
          isMut: true,
          isSigner: false,
          docs: ["The global platform config."],
        },
      ],
      args: [],
    },
    {
      name: "deposit",
      docs: [
        "Allows anyone to deposit tokens for staking.",
        "",
        "# Arguments",
        "",
        "* `amount` - The amount of tokens to deposit for staking.",
      ],
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: true,
          docs: ["The depositer."],
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
          docs: ["The token to be used for staking."],
        },
        {
          name: "platformConfig",
          isMut: false,
          isSigner: false,
          docs: ["The global platform config."],
        },
        {
          name: "platformMintTokenAccount",
          isMut: true,
          isSigner: false,
          docs: ["Vault to store deposited tokens."],
        },
        {
          name: "userMintTokenAccount",
          isMut: true,
          isSigner: false,
          docs: ["User's token account to use for deposit."],
        },
        {
          name: "depositInfo",
          isMut: true,
          isSigner: false,
          docs: ["The user's deposit info."],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "withdraw",
      docs: [
        "Allows anyone with a valid deposit to unstake.",
        "",
        "# Arguments",
        "",
        "* `amount` - The amount of tokens to withdraw.",
      ],
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: true,
          docs: ["The withdrawer."],
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
          docs: ["The token to be used for staking."],
        },
        {
          name: "platformConfig",
          isMut: false,
          isSigner: false,
          docs: ["The global platform config."],
        },
        {
          name: "platformMintTokenAccount",
          isMut: true,
          isSigner: false,
          docs: ["Vault to store deposited tokens."],
        },
        {
          name: "userMintTokenAccount",
          isMut: true,
          isSigner: false,
          docs: ["User's token account to use for deposit."],
        },
        {
          name: "depositInfo",
          isMut: true,
          isSigner: false,
          docs: ["The user's deposit info."],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "DepositInfo",
      type: {
        kind: "struct",
        fields: [
          {
            name: "user",
            type: "publicKey",
          },
          {
            name: "amount",
            type: "u64",
          },
          {
            name: "lastWithdrawAmount",
            type: "u64",
          },
          {
            name: "lastWithdrawTimestamp",
            type: "i64",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "PlatformConfig",
      type: {
        kind: "struct",
        fields: [
          {
            name: "admin",
            type: "publicKey",
          },
          {
            name: "mint",
            type: "publicKey",
          },
          {
            name: "isDepositPaused",
            type: "bool",
          },
          {
            name: "isWithdrawPaused",
            type: "bool",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "mintTokenAccountBump",
            type: "u8",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "ValueZero",
      msg: "Value zero",
    },
    {
      code: 6001,
      name: "InsufficientDeposit",
      msg: "Insufficient deposit",
    },
    {
      code: 6002,
      name: "DepositsPaused",
      msg: "Deposits paused",
    },
    {
      code: 6003,
      name: "WithdrawalsPaused",
      msg: "Withdrawals paused",
    },
  ],
};

export const HOST_CONTRACT = { IDL, PROGRAM_ID };
