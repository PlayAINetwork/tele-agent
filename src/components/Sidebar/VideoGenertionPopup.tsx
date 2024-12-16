import  { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useTokenBalance } from "@/hooks/token/useGetTokenBalance";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { useAppCtx } from "@/context/app.contex";
import { trimAddress, truncateText } from "@/lib/utils";
import { VideoPlayer } from "./GenerateVedio";
import { ICONS } from "@/assets";
import { Button } from "../ui/button";

import { Input } from "../ui/input";

const VideoGenertionPopup = () => {
  const { disableAction, setDisableAction, videoGeneraing, setVideoGeneraing } =
    useAppCtx();
  const { connected, publicKey, signTransaction } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const [prompt, setPrompt] = useState("");
  const { balance } = useTokenBalance(publicKey);
  const [status, setStatus] = useState<any>(null);
  // const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [recentlist, setRecentlist] = useState<any>(null);

  const injectAmount = 30000;

  const amount = BigInt(injectAmount * 10 ** 6);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        "https://render-video.agentexperience.live/get-all-files-in-bucket"
      );
      const filteredData = response?.data.filter(
        (item: any) => item[3] != "0x"
      );
      setRecentlist(filteredData.reverse());
    })();
  }, [disableAction]);

  useEffect(() => {
    console.log(selectedFile);
  }, [selectedFile]);

  const connection = new Connection(import.meta.env.VITE_SOL_RPC);

  const transferTokens = async () => {
    if (prompt === "") {
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
      setVideoGeneraing(true);
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
      console.log("response");
      setStatus("Generating Video...");

      const response = await axios.post(
        "https://render-video.agentexperience.live/generate",
        // "https://aaac-2a01-4f8-c012-6c7-00-1.ngrok-free.app/generate",
        // "https://render.dhanush29.me/generate",
        { prompt: prompt, signature: signature, wallet: publicKey?.toString() },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);

      if (response.status == 500) {
        toast({
          title: " Faild to create video ",
        });
      }
      if (response.status == 200) {
        // createVedio({
        //   url: response.data.url,
        //   user: publicKey?.toString(),
        //   prompt: prompt,
        // });
        setSelectedFile([1, response.data.url, response.data.title]);
        setIsOpen(true);

        toast({
          title: " Creation is successufll",
        });

        // console.log(confirmation);

        //   setStatus("Transfer successful! Signature: " + signature);
        setVideoGeneraing(false);
        setPrompt("");
        setDisableAction(false);
      }

      setDisableAction(false);
    } catch (err: any) {
      // setStatus("Error: " + err.message);
      setVideoGeneraing(false);
      setDisableAction(false);

      toast({
        title: " Error",
        description: err.message,
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="w-full  px-12 font-700 cursor-pointer h-full bg-[#383838] text-nowrap flex justify-center items-center"
          style={{
            clipPath: "polygon(0 0, 85% 0%, 100% 100%, 0% 100%)",
          }}
        >
          {"> Create w/ Rogue <"}
        </div>
      </DialogTrigger>

      <DialogContent className=" flex flex-col sm:max-w-md md:max-w-[70%] gap-0 h-[70vh] border-2 border-primary binaria bg-[#181818] p-0 pt-0 overflow-auto ">
        <div className="flex justify-between">
          <DialogDescription className=" px-4 text-md text-gray-200 py-2   bg-primary text-[#010101]">
            {">> create_video_with_rogue"}
          </DialogDescription>
        </div>
        <div className=" flex-1 h-full overflow-auto ">
          <div className="flex flex-col  h-full  border-primary border-[1px]  gap-4     bg-[#131314] ">
            {recentlist?.length > 0 ? null : (
              <div className="flex gap-2 flex-wrap w-[100%] animate-pulse">
                <div className="grid grid-cols-5 w-[100%]  gap-2">
                  <div className="h-[150px]  w-[100%]  bg-foreground"></div>
                  <div className="h-[150px] w-[100%] bg-foreground"></div>
                  <div className="h-[150px]  w-[100%] bg-foreground"></div>
                  <div className="h-[150px]  w-[100%] bg-foreground"></div>

                  <div className="h-[150px]  w-[100%] bg-foreground"></div>
                  <div className="h-[150px]  w-[100%] bg-foreground"></div>

                  <div className="h-[150px]  w-[100%] bg-foreground"></div>
                  <div className="h-[150px]  w-[100%] bg-foreground"></div>
                  <div className="h-[150px]  w-[100%] bg-foreground"></div>
                  <div className="h-[150px]  w-[100%] bg-foreground"></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-5 ">
              {videoGeneraing ? (
                <div className="h-[180px]  w-[100%]  bg-foreground animate-pulse"></div>
              ) : null}

              {recentlist?.map((recent: any) => (
                <>
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild={false}>
                      <div
                        className={`w-[100%] border border-input  max-h-[180px] uppercase cursor-pointer   relative overflow-hidden ${recent[3] === publicKey?.toString() ? "border-4" : null}`}
                        onClick={() => setSelectedFile(recent)}
                      >
                        <img
                          width={"100%"}
                          height={"100%"}
                          className="object-contain"
                          src="https://pbs.twimg.com/profile_images/1859652186025885696/cPRtjjm9_400x400.jpg"
                          alt=""
                        />
                        <div className="absolute bottom-0  left-0 right-0 p-1 bg-black  group-hover:opacity-100 transition-opacity flex flex-col justify-center gap-0 px-2">
                          <div className={`flex items-center gap-1   w-full `}>
                            <img
                              src={ICONS.icon_textarrow}
                              alt=""
                              className="max-h-[13px]"
                              height={9}
                            />
                            <p className="text-sm uppercase py-[3px] text-center">
                              <span className="font-bold">
                                {" "}
                                {truncateText(recent[2]?.toString())}{" "}
                              </span>
                            </p>
                          </div>
                          <p className="text-[12px] text-[#B6B6B6]  ">
                            {">> by:" +
                              " " +
                              trimAddress(
                                truncateText(recent[3]?.toString()),
                                5
                              )}{" "}
                            {}
                          </p>
                        </div>
                      </div>
                    </DialogTrigger>

                    <DialogContent className=" flex flex-col sm:max-w-md md:max-w-[55%] gap-0  border-2 border-primary binaria bg-[#181818] p-0 pt-0 overflow-auto ">
                      <div className="flex justify-between">
                        {selectedFile !== null ? (
                          <DialogDescription className=" px-4 text-md text-gray-200 py-2   bg-primary text-[#010101]">
                            {">> " + selectedFile[2]}
                          </DialogDescription>
                        ) : null}
                      </div>
                      <div className="  h-full w-full  ">
                        {selectedFile !== null ? (
                          <div className="py-0 h-full w-full">
                            <VideoPlayer videoUrl={selectedFile[1]} />
                          </div>
                        ) : null}
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap"></div>
          </div>
        </div>

        {connected ? (
          <div>
            <div className="border-t-[1px] border-primary py-2 px-2 flex uppercase justify-end w-full">
              <p className="text-[14px] text-[#B6B6B6]">
                video_generation_takes a bout_2-3
                mins_once_payment_is_validated.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex w-full  border-t-[1px] border-primary">
                {/* <Textarea
              className="h-[50px]  binaria uppercase placeholder-white"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Inject your topic here"
            /> */}
                <Input
                  className="pr-[40px] binaria border-none  uppercase hover:bg-[#303030]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  type="text"
                  placeholder="type_your_request_here"
                  disabled={disableAction}
                  // onKeyPress={handleKeyPress}
                />
                <Button
                  className=" uppercase "
                  onClick={transferTokens}
                  disabled={videoGeneraing || !connected || disableAction}
                >
                  {videoGeneraing
                    ? status || "Generating Video..."
                    : `Create with 30k $ROGUE`}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default VideoGenertionPopup;
