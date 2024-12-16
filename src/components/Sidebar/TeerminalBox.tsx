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
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useAppCtx } from "@/context/app.contex";
import { api } from "../../../convex/_generated/api";

import {  useQuery } from "convex/react";
import { trimAddress } from "@/lib/utils";
import { ICONS, IMAGES } from "@/assets";
import { Input } from "../ui/input";

const recipientAddress = import.meta.env.VITE_BANK;

const TeerminalBox = () => {
  // const sendInject = useMutation(api.functions.inject.sendInject);
  const messages = useQuery(api.functions.inject.getAllInject);

  const { connected, publicKey, signTransaction } = useWallet();
  const { balance } = useTokenBalance(publicKey);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState(""); // Default amount
  const connection = new Connection(import.meta.env.VITE_SOL_RPC);
  // const address: any = publicKey?.toString();
  const boxRef: any = useRef(null);
  const isInjext = false;

  const injectAmount = 20;
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
      setTimeout(async () => {
        const response = await axios.post(
          "https://botcast-backend-production-bb45.up.railway.app/inject_topic",
          { topic: topic, txHash: signature },
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
          // sendInject({ user: address, text: topic });

          toast({
            title: " Topic injection is successufll",
          });

          // console.log(confirmation);

          setStatus("Transfer successful! Signature: " + signature);
          setLoading(false);
          setTopic("");
          setDisableAction(false);
        }
        setDisableAction(false);
      }, 7000);

      // toast({
      //   title: "Transaction completed successfully",
      // });
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
    <div className="flex flex-col gap-0  h-full binaria ">
      <div className="border-b-[1px] border-primary py-2 px-2 flex uppercase justify-end w-full">
        <p className="text-[14px] text-[#B6B6B6]">
          topic_injc_cost_20,000_$ROGUE.
        </p>
      </div>
      <div
        ref={boxRef}
        className="flex flex-col relative flex-1 h-full realtive  gap-0 overflow-auto h-full bg-[#131314] "
      >
        {isInjext ? (
          messages?.map(
            ({
              _id,
              text,
              user,
            }: {
              _id: string;
              text: string;
              user: string;
            }) => (
              <div key={_id}>
                <div className="flex gap-2 uppercase items-start binaria px-4 py-3 ">
                  <div className="flex items-center gap-1">
                    <img
                      src={ICONS.icon_textarrow}
                      alt=""
                      className="max-h-[13px]"
                      height={13}
                    />
                    <p className="text-[14px] text-[#B6B6B6]">
                      {trimAddress(user, 3)}:
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-thin text-wrap pl-4 ">{text}</p>
                  </div>{" "}
                </div>
                <div className="border-b-[1px] border-[#F1F6F2]"></div>
              </div>
            )
          )
        ) : (
          <>
            <div className="absolute w-full h-full">
              <img src={IMAGES.notshow} alt="" className="h-full " />
              <div className="flex items-center  absolute  top-[0] h-full gap-1 w-full   justify-center ">
                <div className="bg-primary py-6 w-full">
                  <p className="text-md uppercase py-[3px] text-center  text-[#010101]">
                    <span className="">
                      rogue_is_not_live_right_now.
                      try_topic_injection_when_rogue_is_live.
                    </span>
                  </p>
                </div>
              </div>
            </div>
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
                <div key={_id}>
                  <div className="flex gap-2 uppercase items-start binaria px-4 py-3 ">
                    <div className="flex items-center gap-1">
                      <img
                        src={ICONS.icon_textarrow}
                        alt=""
                        className="max-h-[13px]"
                        height={13}
                      />
                      <p className="text-[14px] text-[#B6B6B6]">
                        {trimAddress(user, 3)}:
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-thin text-wrap pl-4 ">
                        {text}
                      </p>
                    </div>{" "}
                  </div>
                  <div className="border-b-[1px] border-[#F1F6F2]"></div>
                </div>
              )
            )}
          </>
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
      {connected ? (
        <div className="flex flex-col gap-2 ">
          <div className="flex w-full  border-t-[1px] border-primary">
            {/* <Textarea
              className="h-[50px]  binaria uppercase placeholder-white"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Inject your topic here"
            /> */}
            <Input
              className="pr-[40px] binaria border-none  uppercase hover:bg-[#303030]"
              value={topic}
              type="text"
              placeholder="type_your_topic_here"
              disabled={disableAction}
              onChange={(e) => setTopic(e.target.value)}
              // onKeyPress={handleKeyPress}
            />
            <Button
              className=" uppercase "
              onClick={transferTokens}
              disabled={
                loading || !connected || disableAction || balance < injectAmount
              }
            >
              {loading ? status : `injc_topic`}
            </Button>
          </div>
          {/* <p className="text-sm text-wrap font-thin leading-5">
            <span className="font-semibold">Disclaimer:</span>{" "}
            <span
              style={{ color: "rgb(248 134 88)" }}
              className="text-[rgb(248 134 88)]"
            >
              Topic injection isn’t instantaneous due to the high volume of
              requests, which may result in a queue.
            </span>
          </p> */}
          {/* <p className="text-sm text-green-600 font-medium">{status}</p> */}
        </div>
      ) : null}
    </div>
  );
};

export default TeerminalBox;
