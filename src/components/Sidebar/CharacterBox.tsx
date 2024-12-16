import { ICONS, IMAGES } from "@/assets";
import { useState } from "react";
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
import axios from "axios";
import { Button } from "../ui/button";

const CharacterBox = () => {
  const characterList = [
    {
      name: "ThreadGuy",
      image: IMAGES.img_elon,
      id: 10001,
      amount: 10,
    },
    {
      name: "Elon Musk",
      image: IMAGES.img_naval,

      id: 10002,
      amount: 10,
    },
    {
      name: "Donald Trump",
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
      console.log(confirmation, "confirmation");

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
      console.log(txInfo);
      const response = await axios.post(
        "https://botcast-backend-production-bb45.up.railway.app/inject_character",
        { characterName: selectedCharacter?.name, txHash: signature },
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
        setSelectedCharacter(null);
        setDisableAction(false);
      }

      toast({
        title: "Transaction completed successfully",
      });
    } catch (err: any) {
      setDisableAction(false);

      console.error("Transaction error:", err);
    }
  };
  return (
    <div className="flex flex-col  gap-0 h-full">
      <div className="border-b-[1px] border-primary py-2 px-2 flex uppercase justify-end w-full">
        <p className="text-[13px] text-[#B6B6B6]">
          characteer_injc_cost_30,000_$ROGUE. added for hour only.
        </p>
      </div>
      <div className="relative flex-1 bg-muted overflow-auto h-full ">
        <div className="absolute w-full h-full">
          <img src={IMAGES.notshow} alt="" className="h-full  w-full " />
          <div className="flex items-center  absolute  top-[0] h-full gap-1 w-full   justify-center ">
            <div className="bg-primary py-6 w-full">
              <p className="text-md uppercase py-[3px] text-center  text-[#010101]">
                <span className="">
                  rogue_is_not_live_right_now.
                  try_character_injection_when_rogue_is_live.
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[1px] overflow-auto h-full ">
          {characterList?.map((item) => (
            <div
              className={`w-full h-[max-content] border border-input cursor-pointer ${selectedCharacter?.id === item.id ? "bg-primary text-primary-foreground" : "bg-[transparant]"} `}
              onClick={() =>
                disableAction ? null : setSelectedCharacter(item)
              }
            >
              <img src={item.image} alt="" />
              <div className=" flex flex-col items-center ">
                <div
                  className={`flex items-center gap-1  justify-center  w-full ${selectedCharacter?.id === item.id ? "bg-[#F1F6F2]" : ""} `}
                >
                  <img
                    src={ICONS.icon_textarrow}
                    alt=""
                    className="max-h-[13px]"
                    height={9}
                  />
                  <p className="text-sm uppercase py-[3px] text-center">
                    <span className="font-bold">{item?.name} </span>
                  </p>
                </div>
                <div className="flex items-center gap-1 w-full   justify-center">
                  <p className="text-sm uppercase py-[3px] text-center">
                    {"> cost:"}
                    <span className="font-bold">30,000 $ROGUE </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 hidden">
        {connected ? (
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
        ) : null}
      </div>
    </div>
  );
};

export default CharacterBox;
