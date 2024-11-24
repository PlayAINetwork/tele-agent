import { IMAGES } from "@/assets";
import { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTokenBalance } from "@/hooks/token/useGetTokenBalance";
import { useAppCtx } from "@/context/app.contex";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";

const CharacterBox = () => {
  const characterList = [
    {
      name: "elon",
      image: IMAGES.img_elon,
      id: 10001,
      amount: 100000,
    },
    {
      name: "naval",
      image: IMAGES.img_naval,

      id: 10002,
      amount: 100000,
    },
    {
      name: "trump",
      image: IMAGES.img_trump,

      id: 10003,
      amount: 100000,
    },
    {
      name: "kamala",
      image: IMAGES.img_kamala,

      id: 10004,
      amount: 100000,
    },
    {
      name: "mike tyson",
      image: IMAGES.img_mick,

      id: 10005,
      amount: 100000,
    },
    {
      name: "balaji",
      image: IMAGES.img_balaji,

      id: 10006,
      amount: 100000,
    },
  ];

  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const { toast } = useToast();
  const { publicKey, signTransaction, connected } = useWallet();
  const { balance } = useTokenBalance(publicKey);
  const { disableAction, setDisableAction } = useAppCtx();
  const [status, setStatus] = useState("");
  const connection = new Connection(import.meta.env.VITE_SOL_RPC);
  const updateChacter = async () => {
    if (selectedCharacter == null) {
      toast({
        title: "Select a character",
      });
      return false;
    } else if (balance < selectedCharacter?.amount) {
      toast({
        title: "Insufficient Balance",
      });
      return false;
    }
    if (!publicKey || !signTransaction) return;
    console.log(status);
    try {
      setStatus("Processing transfer...");
      setDisableAction(true);

      const mintPubkey = new PublicKey(import.meta.env.VITE_SPL_TOKEN_ADDRESS);
      const recipientPubKey = new PublicKey(import.meta.env.VITE_BANK);

      // Get the associated token accounts for sender and recipient
      const senderATA = await getAssociatedTokenAddress(mintPubkey, publicKey);
      const recipientATA = await getAssociatedTokenAddress(
        mintPubkey,
        recipientPubKey
      );

      const transaction = new Transaction();

      // Check if recipient's ATA exists, if not, create it
      try {
        await getAccount(connection, recipientATA);
      } catch (e) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            recipientATA,
            recipientPubKey,
            mintPubkey
          )
        );
      }
      const value = BigInt(Number(selectedCharacter.amount) * 10 ** 6);
      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          senderATA,
          recipientATA,
          publicKey,
          BigInt(value), // amount is in base units
          [],
          TOKEN_PROGRAM_ID
        )
      );

      // Sign and send transaction
      const latestBlockhash = await connection.getLatestBlockhash();

      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = publicKey;
      const signed = await signTransaction(transaction);

      const signature = await connection.sendRawTransaction(signed.serialize());
      // Wait for transaction confirmation
      const confirmation = await connection.confirmTransaction(
        {
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        "confirmed"
      );

      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      // Verify the transaction was successful
      const txInfo = await connection.getParsedTransaction(signature, {
        maxSupportedTransactionVersion: 0,
      });

      if (txInfo?.meta?.err) {
        throw new Error("Transaction failed during execution");
      }

      toast({
        title: "Transaction completed successfully",
      });
      setSelectedCharacter(null);
      setDisableAction(false);
    } catch (err: any) {
      setDisableAction(false);

      console.error("Transaction error:", err);
    }
  };
  return (
    <div className="flex flex-col  gap-4 h-full">
      <div className="flex-1 bg-muted p-4">
        <div className="grid grid-cols-3 gap-4 ">
          {characterList?.map((item) => (
            <div
              className={`w-full h-[max-content] border border-input cursor-pointer ${selectedCharacter?.id === item.id ? "bg-primary text-primary-foreground" : "bg-[transparant]"} `}
              onClick={() =>
                disableAction ? null : setSelectedCharacter(item)
              }
            >
              <img src={item.image} alt="" />
              <p className="text-sm uppercase py-[3px] text-center">
                <span className="font-bold">{item?.name} </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative w-full">
          <Button
            disabled={disableAction || !connected}
            onClick={updateChacter}
            //   variant={"ghost"}
            className="w-full"
          >
            ADD CHARACTER WITH 100K $ROGUE
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CharacterBox;
