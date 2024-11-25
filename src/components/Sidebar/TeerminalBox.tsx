import { Button } from "../ui/button";

import { useEffect, useRef, useState } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  // TransactionConfirmationStrategy,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  getAccount,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTokenBalance } from "@/hooks/token/useGetTokenBalance";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useAppCtx } from "@/context/app.contex";
import { api } from "../../../convex/_generated/api";

import { useMutation, useQuery } from "convex/react";
import { trimAddress } from "@/lib/utils";

const recipientAddress = import.meta.env.VITE_BANK;

const TeerminalBox = () => {
  const sendInject = useMutation(api.functions.inject.sendInject);
  const messages = useQuery(api.functions.inject.getAllInject);

  const { connected, publicKey, signTransaction } = useWallet();
  const { balance } = useTokenBalance(publicKey);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState(""); // Default amount
  const connection = new Connection(import.meta.env.VITE_SOL_RPC);
  const address: any = publicKey?.toString();
  const boxRef: any = useRef(null);

  const injectAmount = 20000;
  const amount = BigInt(injectAmount * 10 ** 6);
  // const { connection } = useConnection();
  const { toast } = useToast();
  const { disableAction, setDisableAction } = useAppCtx();

  const transferTokens = async () => {
    if (topic === "") {
      toast({
        title: "Enter your Topic",
      });
      return false;
    } else if (balance < injectAmount) {
      toast({
        title: "Insufficient Balance",
      });
      return false;
    }
    if (!publicKey || !signTransaction) return;

    try {
      setStatus("Processing transfer...");
      setLoading(true);
      setDisableAction(true);

      const mintPubkey = new PublicKey(import.meta.env.VITE_SPL_TOKEN_ADDRESS);
      const recipientPubKey = new PublicKey(recipientAddress);

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

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          senderATA,
          recipientATA,
          publicKey,
          BigInt(amount), // amount is in base units
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
      console.log(signature);

      // const confirmationStrategy: TransactionConfirmationStrategy = {
      //   signature,
      //   blockhash: latestBlockhash.blockhash,
      //   lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      // };

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
      const response = await axios.post(
        "https://agent-paywall.up.railway.app/submit-topic",
        { topic: topic, hash: signature },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status == 500) {
        toast({
          title: " Faild to inject topic ",
        });
      }
      if (response.status == 200) {
        sendInject({ user: address, text: topic });

        toast({
          title: " Topic injection is successufll",
        });

        // console.log(confirmation);

        setStatus("Transfer successful! Signature: " + signature);
        setLoading(false);
        setTopic("");
        setDisableAction(false);
      }

      // toast({
      //   title: "Transaction completed successfully",
      // });
      setDisableAction(false);
    } catch (err: any) {
      // setStatus("Error: " + err.message);
      setLoading(false);
      setDisableAction(false);

      toast({
        title: " Error",
        description: err.message,
      });
    }
  };
  useEffect(() => {
    // Scroll to the bottom whenever logs change
    if (boxRef.current) {
      boxRef.current.scrollTo({
        top: boxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col gap-4  h-full ">
      <div
        ref={boxRef}
        className="flex flex-col flex-1   gap-2 overflow-auto h-full bg-muted p-4 "
      >
        {messages?.map(
          ({
            _id,
            text,
            user,
          }: {
            _id: string;
            text: string;
            user: string;
          }) => (
            <div key={_id} className="flex gap-2 items-center">
              <p className="text-[14px] font-semibold">{trimAddress(user)}:</p>
              <p
                className="text-sm 
            text-wrap "
              >
                {text}
              </p>
            </div>
          )
        )}
      </div>
      {/* <div className="flex justify-between items-center">
        {balance && (
          <p className="text-sm">
            <span className="font-bold">$ROGUE: </span>
            {balance}
          </p>
        )}
      </div> */}
      <div className="flex flex-col gap-2">
        <Textarea
          className="h-[100px] uppercase"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Inject your topic here"
        />
        <Button
          className="w-full uppercase"
          onClick={transferTokens}
          disabled={
            loading || !connected || disableAction || balance < injectAmount
          }
        >
          {loading
            ? status
            : balance < injectAmount
              ? "Insufficient Balance"
              : `Add with 20k $ROGUE`}
        </Button>
        <p className="text-sm text-wrap font-thin leading-6">
          <span className="font-semibold">Disclaimer:</span> Topic injection
          isn’t instantaneous due to the high volume of requests, which may
          result in a queue.
        </p>
        {/* <p className="text-sm text-green-600 font-medium">{status}</p> */}
      </div>
    </div>
  );
};

export default TeerminalBox;
