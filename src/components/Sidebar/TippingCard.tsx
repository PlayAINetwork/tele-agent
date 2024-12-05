import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAppCtx } from "@/context/app.contex";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useTokenBalance } from "@/hooks/token/useGetTokenBalance";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
const connection = new Connection(import.meta.env.VITE_SOL_RPC);

const TippingCard = ({ close }: { close: any }) => {
  const [amount, setAmount] = useState<string>("");
  const sends = useMutation(api.functions.chats.send);

  const { disableAction, setDisableAction } = useAppCtx();
  const { toast } = useToast();
  const [status, setStatus] = useState("");
  const { publicKey, signTransaction } = useWallet();
  const { balance } = useTokenBalance(publicKey);
  const address: any = publicKey?.toString();

  const sendTip = async () => {
    if (amount === "") {
      toast({
        title: "Enter your Amount",
      });
      return false;
    } else if (balance < Number(amount)) {
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
      const value = BigInt(Number(amount) * 10 ** 6);
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
      console.log(signature);

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
      console.log(txInfo, "txInfo");

      // setTimeout(() => {
      sends({ user: address, text: `Tipped ${amount} $ROGUE` });
      toast({
        title: "Transaction completed successfully",
      });
      setAmount("");
      setDisableAction(false);
      // }, 8000);
    } catch (err: any) {
      setDisableAction(false);
      toast({
        title: "Transaction error",
      });
      console.error("Transaction error:", err);
    }
  };

  return (
    <div className="rounded-md bg-[#131314] flex flex-col gap-4 p-4 py-6">
      <div className="flex justify-between items-center">
        <p className="text-sm">
          <span className="font-bold">$ROGUE: </span>
          {balance ?? 0}
        </p>
      </div>
      <div className="relative w-full">
        <Input
          // className="py-4 px-4"
          className="pr-[70px] hover:border-[#B5B6B7] rounded-[40px] bg-[#131314] hover:bg-[#303030]"
          value={amount}
          type="number"
          placeholder="0.00"
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="absolute right-4 top-0 h-full flex justify-center items-center">
          <p className="text-[14px] ">$ROGUE</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          disabled={disableAction}
          className="bg-[#444746] rounded-[40px] w-full text-primary"
          onClick={() => close(false)}
        >
          Cancel
        </Button>
        <Button
          disabled={disableAction || balance < Number(amount)}
          className="w-full rounded-[40px]"
          onClick={sendTip}
        >
          {balance < Number(amount) ? "Insufficient Balance" : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default TippingCard;
