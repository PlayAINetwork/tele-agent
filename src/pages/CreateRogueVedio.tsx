import { useAppCtx } from "@/context/app.contex";
import React, { useEffect, useState } from "react";

import { useTokenBalance } from "@/hooks/token/useGetTokenBalance";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

import { trimAddress, truncateText } from "@/lib/utils";
import { Play, Square, Voicemail, Volume2, VolumeX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ICONS } from "@/assets";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const CreateRogueVedio = () => {
  const { setVisible } = useWalletModal();
  const { disableAction, setDisableAction, videoGeneraing, setVideoGeneraing } =
    useAppCtx();
  const { connected, publicKey, signTransaction } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const navigator = useNavigate();
  const [prompt, setPrompt] = useState("");
  const { balance } = useTokenBalance(publicKey);
  const [status, setStatus] = useState<any>(null);
  // const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  // const createVedio = useMutation(api.functions.createVedio.create);
  const [recentlist, setRecentlist] = useState<any>(null);
  const [myCreatedVideos, setMyCreatedVideos] = useState<any[]>([]);

  const injectAmount = 30000;

  const amount = BigInt(injectAmount * 10 ** 6);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        "https://render-video.agentexperience.live/get-all-files-in-bucket"
      );
      // Filter out items with "0x" address
      const validVideos = response.data.filter((item: any) => item[3] !== "0x");

      // Separate videos into two lists
      const userVideos: any[] = [];
      const otherVideos: any[] = [];
      validVideos.forEach((item: any) => {
        // const videoItem = {
        //   id: item[0],
        //   name: item[1],
        //   url: item[2],
        //   address: item[3],
        //   // Map other properties as needed
        // };

        if (item[3] === publicKey?.toString()) {
          userVideos.push(item);
        } else {
          otherVideos.push(item);
        }
      });

      // Set both lists with reversed order for newest first
      setMyCreatedVideos(userVideos.reverse());
      setRecentlist(otherVideos.reverse());
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
    <div className=" h-full  flex flex-col gap-4     ">
      <div>
        <Button
          className="bg-[#383838] text-white text-xs md:text-md h-auto "
          onClick={() => navigator(-1)}
        >
          ← go back
        </Button>
      </div>
      <div className="flex flex-col flex-1  gap-3    ">
        <div className=" px-4 uppercase text-sm md:text-md font-semibold py-2   border-[1px] border-primary text-primary">
          {">> recent community creations <<"}
        </div>

        <div className="flex flex-col flex-1     overflow-auto h-full ">
          {recentlist?.length > 0 ? null : (
            <div className="flex gap-2 flex-wrap w-[100%] animate-pulse">
              <div className="flex gap-4 overflow-x-auto w-[100%]  ">
                <div className="h-[150px]  min-w-64  bg-foreground"></div>
                <div className="h-[150px]  min-w-64 bg-foreground"></div>
                <div className="h-[150px]  min-w-64 bg-foreground"></div>
                <div className="h-[150px]  min-w-64 bg-foreground"></div>
                <div className="h-[150px]  min-w-64 bg-foreground"></div>
              </div>
            </div>
          )}

          <div className="flex gap-4 overflow-x-auto">
            {/* {videoGeneraing ? (
             <div className="h-[180px]  min-w-60  bg-foreground animate-pulse"></div>
            ) : null} */}

            {recentlist?.map((recent: any) => (
              <>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild={false}>
                    <div
                      className={` border border-input  max-h-[180px] w-64 h-60 uppercase cursor-pointer   relative overflow-hidden ${recent[3] === publicKey?.toString() ? "bg-primary" : "bg-primary"}`}
                      onClick={() => setSelectedFile(recent)}
                    >
                      <img
                        width={"100%"}
                        height={"100%"}
                        className="object-contain"
                        src="https://pbs.twimg.com/profile_images/1859652186025885696/cPRtjjm9_400x400.jpg"
                        alt=""
                      />
                      <div
                        className={`absolute bottom-0  left-0 right-0 p-1  group-hover:opacity-100 transition-opacity flex flex-col justify-center items-start gap-0 px-2 ${recent[3] === publicKey?.toString() ? "bg-primary text-black" : "bg-black "}`}
                      >
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
                        <p
                          className={`text-[12px] ${recent[3] === publicKey?.toString() ? "text-[#000]" : "text-[#B6B6B6]"}   `}
                        >
                          {">> by:" +
                            " " +
                            trimAddress(truncateText(recent[3]?.toString()), 5)}
                          {recent[3] === publicKey?.toString() ? "[YOU]" : null}
                          {}
                        </p>
                      </div>
                    </div>
                  </DialogTrigger>

                  <DialogContent className=" flex flex-col sm:max-w-md md:max-w-[55%] gap-0  border-2 border-primary binaria bg-[#181818] p-0 pt-0 overflow-auto ">
                    <div className="flex justify-between  border-b-[1px] border-primary">
                      <div className="flex items-center">
                        <DialogDescription className=" px-4 uppercase text-sm  py-2   text-[#fff]">
                          {">> create_video_with_rogue"}
                        </DialogDescription>
                        <DialogDescription className=" px-4 uppercase text-sm  py-2   bg-primary text-[#010101]">
                          {">> video_player"}
                        </DialogDescription>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      {selectedFile !== null ? (
                        <DialogDescription className=" px-4 text-md  py-2   border-b-[1px] w-full  border-primary text-[#fff] text-xs">
                          {">> " + selectedFile[2]}
                        </DialogDescription>
                      ) : null}
                    </div>
                    <div className="  h-full w-full  ">
                      {selectedFile !== null ? (
                        <div className="py-0 h-full w-full">
                          <VideoPlayer
                            videoUrl={selectedFile[1]}
                            user={selectedFile[3]}
                            text={selectedFile[2]}
                          />
                        </div>
                      ) : null}
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            ))}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap"></div>
      </div>

      <div className="flex flex-col flex-1  gap-3    ">
        <div className=" px-4 uppercase text-sm md:text-md font-semibold py-2   border-[1px] bg-primary text-black">
          {">> your requests <<"}
        </div>

        <div className="flex flex-col flex-1     overflow-auto h-full ">
          {videoGeneraing ? null : myCreatedVideos?.length >= 0 ? (
            <div className=" px-4 uppercase text-sm md:text-mdfont-semibold py-2  text-center  text-white">
              {">> not Found  any Videos  <<"}
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap w-[100%] animate-pulse">
              <div className="grid grid-cols-5 w-[100%]  gap-2">
                <div className="h-[150px]  min-w-64  bg-foreground"></div>
                <div className="h-[150px]  min-w-64 bg-foreground"></div>
                <div className="h-[150px]  min-w-64 bg-foreground"></div>
                <div className="h-[150px]  min-w-64 bg-foreground"></div>
                <div className="h-[150px]  min-w-64 bg-foreground"></div>
              </div>
            </div>
          )}

          <div className="flex gap-4 overflow-x-auto">
            {videoGeneraing ? (
              <div className="h-60  w-64 bg-foreground"></div>
            ) : null}

            {myCreatedVideos?.map((recent: any) => (
              <>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild={false}>
                    <div
                      className={` border border-input   w-64 h-60 uppercase cursor-pointer   relative overflow-hidden ${recent[3] === publicKey?.toString() ? "bg-primary" : "bg-primary"}`}
                      onClick={() => setSelectedFile(recent)}
                    >
                      <img
                        width={"100%"}
                        height={"100%"}
                        className="object-contain"
                        src="https://pbs.twimg.com/profile_images/1859652186025885696/cPRtjjm9_400x400.jpg"
                        alt=""
                      />
                      <div
                        className={`absolute bottom-0  left-0 right-0 p-1  group-hover:opacity-100 transition-opacity flex flex-col justify-center items-start gap-0 px-2 ${recent[3] === publicKey?.toString() ? "bg-primary text-black" : "bg-black "}`}
                      >
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
                        <p
                          className={`text-[12px] ${recent[3] === publicKey?.toString() ? "text-[#000]" : "text-[#B6B6B6]"}   `}
                        >
                          {">> by:" +
                            " " +
                            trimAddress(truncateText(recent[3]?.toString()), 5)}
                          {recent[3] === publicKey?.toString() ? "[YOU]" : null}
                          {}
                        </p>
                      </div>
                    </div>
                  </DialogTrigger>

                  <DialogContent className=" flex flex-col sm:max-w-md md:max-w-[55%] gap-0  border-2 border-primary binaria bg-[#181818] p-0 pt-0 overflow-auto ">
                    <div className="flex justify-between  border-b-[1px] border-primary">
                      <div className="flex items-center">
                        <DialogDescription className=" px-4 uppercase text-sm  py-2   text-[#fff]">
                          {">> create_video_with_rogue"}
                        </DialogDescription>
                        <DialogDescription className=" px-4 uppercase text-sm  py-2   bg-primary text-[#010101]">
                          {">> video_player"}
                        </DialogDescription>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      {selectedFile !== null ? (
                        <DialogDescription className=" px-4 text-md  py-2   border-b-[1px] w-full  border-primary text-[#fff] text-xs">
                          {">> " + selectedFile[2]}
                        </DialogDescription>
                      ) : null}
                    </div>
                    <div className="  h-full w-full  ">
                      {selectedFile !== null ? (
                        <div className="py-0 h-full w-full">
                          <VideoPlayer
                            videoUrl={selectedFile[1]}
                            user={selectedFile[3]}
                            text={selectedFile[2]}
                          />
                        </div>
                      ) : null}
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            ))}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap"></div>
      </div>
      <div className="pb-5 md:pb-0">


      {connected ? (
        <div className="border-[1px] border-primary  uppercase w-full md:w-[60%] mx-auto ">
          <div className=" py-2 px-2 flex uppercase justify-end w-full">
            <p className="text-[10px] md:text-[14px] text-[#B6B6B6]">
              video_generation_takes a bout_2-3 mins_once_payment_is_validated.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex w-full  border-t-[1px] border-primary flex-col md:flex-row">
              {/* <Textarea
              className="h-[50px]  binaria uppercase placeholder-white"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Inject your topic here"
            /> */}
              <Input
                className="pr-[40px] binaria border-none text-xs md:text-md uppercase hover:bg-[#303030]"
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
      ) : (
        <div className="flex justify-center">
          <Button
            onClick={() => setVisible(true)}
            className="uppercase  !font-semibold px-20"
          >
            connect to start creating
          </Button>
        </div>
      )}
      </div>

    </div>
  );
};

export const VideoPlayer = ({
  videoUrl,
  user,
  text,
}: {
  videoUrl: string;
  user: any;
  text: any;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef: any = React.useRef(null);

  useEffect(() => {
    const video: any = document.querySelector("video");
    if (video) {
      video.addEventListener("play", () => setIsPlaying(true));
      video.addEventListener("pause", () => setIsPlaying(false));

      return () => {
        video.removeEventListener("play", () => setIsPlaying(true));
        video.removeEventListener("pause", () => setIsPlaying(false));
      };
    }
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      setIsPlaying(!isPlaying);
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }
  };

  const handleMuteUnmute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative group w-full">
      <video
        ref={videoRef}
        controls
        className="w-full rounded-lg"
        src={videoUrl}
        // muted={muted}
        // onEnded={() => setIsPlaying(false)}
      />
      <div className="flex font-[500] h- items-center bg-primary justify-between  border-t border-primary">
        <div className="flex gap-0 h-[40px] text-md  ">
          <div className=" px-3 gap-3 flex items-center">
            <div className="flex text-black gap-1 items-center">
              <Voicemail className="w-4 h-4" />
              created
            </div>
          </div>

          {/* <button
                className="border-primary border-r px-3"
                onClick={handleNextChannel}
                disabled={!power || channel === Object.keys(channels).length}
              >
                <SkipForward className="w-4 h-4 text-primary" />
              </button> */}

          <button
            className="border-primary bg-black border-r px-3"
            onClick={handlePlayPause}
          >
            <div className="flex gap-2 items-center text-primary">
              {isPlaying ? (
                <Square className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isPlaying ? "STOP" : "PLAY"}
            </div>
          </button>

          {/* <button
                className="border-primary border-r px-3"
                onClick={handlePrevChannel}
                disabled={!power || channel === 1}
              >
                <SkipBack className="w-4 h-4 text-primary" />
              </button> */}

          <button
            className="border-primary bg-black border-r px-3"
            onClick={handleMuteUnmute}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-primary" />
            ) : (
              <Volume2 className="w-5 h-5 text-primary" />
            )}
          </button>
        </div>

        <div className="h-full flex">
          <div className="  flex flex-col items-end gap-0 text-black uppercase px-3 border-l border-primary">
            <div className="hidden md:flex">{truncateText(text)}</div>
            <div className="text-sm">{">>BY:" + trimAddress(user, 4)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRogueVedio;
