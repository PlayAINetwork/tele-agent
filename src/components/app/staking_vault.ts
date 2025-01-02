export const IDL :any= {
    "version": "0.1.0",
    "name": "staking_vault",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "createUserAccount",
        "accounts": [
          {
            "name": "userAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userAuthority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "deposit",
        "accounts": [
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userAuthority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "withdraw",
        "accounts": [
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userAuthority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "Vault",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "tokenAccount",
              "type": "publicKey"
            },
            {
              "name": "totalDeposits",
              "type": "u64"
            }
          ]
        }
      },
      {
        "name": "UserAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "depositedAmount",
              "type": "u64"
            },
            {
              "name": "lastDepositTimestamp",
              "type": "i64"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "InvalidAmount",
        "msg": "Amount must be greater than 0"
      },
      {
        "code": 6001,
        "name": "InsufficientBalance",
        "msg": "Insufficient balance"
      },
      {
        "code": 6002,
        "name": "Overflow",
        "msg": "Arithmetic overflow"
      },
      {
        "code": 6003,
        "name": "UnauthorizedAccess",
        "msg": "Unauthorized access"
      }
    ],
    "metadata": {
      "address": "9FFbXVg1oE4z3Vu54MoHpPt9wXG13umRZTnzsoyB6syn"
    }
  }