import { useAppCtx } from "@/context/app.contex";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
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
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { truncateText } from "@/lib/utils";

const GenerateVedio = () => {
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
  const createVedio = useMutation(api.functions.createVedio.create);
  const [recentlist, setRecentlist] = useState<any>(null);

  const injectAmount = 30000;

  const amount = BigInt(injectAmount * 10 ** 6);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        "https://render-video.agentexperience.live/get-all-files-in-bucket"
      );

      setRecentlist(response?.data.reverse());
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
        createVedio({
          url: response.data.url,
          user: publicKey?.toString(),
          prompt: prompt,
        });
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
    <div className="   flex flex-col gap-4  h-full justify-between overflow-auto ">
      {/* <div className=" flex flex-col gap-2 "> */}
      {/* <p className="text-[15px] font-600 ">Recent</p> */}
      {/* <div className="gap-2 flex overflow-auto horizontalBar">
          {recent?.map((recent) => (
            <div className="min-w-[150px] h-[100px] cursor-pointer   relative rounded-md overflow-hidden">
              <img
                width={"100%"}
                height={"100%"}
                className="object-contain"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiCC2REU0Qqv3zVBzMqFSYGLfoVn4uT3TrDA&s"
                alt=""
              />
              <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50  group-hover:opacity-100 transition-opacity flex justify-center gap-4">
                <p className="text-[12px] ">hellow </p>
              </div>
            </div>
          ))}
        </div> */}
      {/* </div> */}
      <div
        //   ref={boxRef}
        className="flex flex-col flex-1    gap-4 overflow-auto h-full  p-4 rounded-md bg-[#131314] "
      >
        {recentlist?.length > 0 ? (
          <p className="text-[15px] font-600 ">Recent</p>
        ) : (
          <div className="flex gap-2 flex-wrap w-[100%] animate-pulse">
            <div className="h-[20px] rounded w-2/5  bg-foreground"></div>

            <div className="grid grid-cols-2 w-[100%]  gap-2">
              <div className="h-[80px] rounded w-[100%]  bg-foreground"></div>
              <div className="h-[80px] rounded w-[100%] bg-foreground"></div>
              <div className="h-[80px] rounded w-[100%] bg-foreground"></div>
              <div className="h-[80px] rounded w-[100%] bg-foreground"></div>

              <div className="h-[80px] rounded w-[100%] bg-foreground"></div>
              <div className="h-[80px] rounded w-[100%] bg-foreground"></div>

              <div className="h-[80px] rounded w-[100%] bg-foreground"></div>
              <div className="h-[80px] rounded w-[100%] bg-foreground"></div>
            </div>
          </div>
        )}

        <div className="flex gap-2 flex-wrap w-[100%] ">
          {videoGeneraing ? (
            <div className="h-[100px] rounded w-[48%]  bg-foreground animate-pulse"></div>
          ) : null}

          {recentlist?.map((recent: any) => (
            <>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <div
                    className={`w-[48%]  max-h-[100px] cursor-pointer   relative rounded-md overflow-hidden ${recent[3] === publicKey?.toString() ? "border-4" : null}`}
                    onClick={() => setSelectedFile(recent)}
                  >
                    <img
                      width={"100%"}
                      height={"100%"}
                      className="object-contain"
                      src="https://pbs.twimg.com/profile_images/1859652186025885696/cPRtjjm9_400x400.jpg"
                      alt=""
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50  group-hover:opacity-100 transition-opacity flex justify-center gap-4">
                      <p className="text-[12px] ">
                        {truncateText(recent[2]?.toString())}{" "}
                      </p>
                    </div>
                  </div>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md md:max-w-2xl">
                  <DialogHeader>
                    {/* <DialogTitle className="text-xl font-semibold">
                    {"recent?.title"}
                    </DialogTitle> */}
                    {selectedFile !== null ? (
                      <DialogDescription className=" text-md text-gray-200">
                        {selectedFile[2]}
                      </DialogDescription>
                    ) : null}
                  </DialogHeader>
                  {selectedFile !== null ? (
                    <div className="py-4">
                      <VideoPlayer videoUrl={selectedFile[1]} />
                    </div>
                  ) : null}
                </DialogContent>
              </Dialog>
            </>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap"></div>
      </div>

      <div className="flex flex-col gap-2">
        <Textarea
          disabled={disableAction}
          className="h-[100px] rounded-lg  placeholder-white"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt to create video"
        />
        {connected ? (
          <Button
            className="w-full uppercase rounded-[40px]"
            onClick={transferTokens}
            disabled={
              videoGeneraing ||
              !connected ||
              disableAction 
            }
          >
            {videoGeneraing
              ? status || "Generating Video..."
              : `Create with 30k $ROGUE`}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default GenerateVedio;

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  // const [isPlaying, setIsPlaying] = useState(false);
  const videoRef: any = React.useRef(null);
  // const [muted, setMuted] = useState(false);
  // const togglePlay = () => {
  //   if (videoRef.current) {
  //     if (isPlaying) {
  //       videoRef.current.pause();
  //     } else {
  //       videoRef.current.play();
  //     }
  //     setIsPlaying(!isPlaying);
  //   }
  // };

  // const toggleMute = () => {
  //   if (videoRef.current) {
  //     setMuted(!muted);
  //     videoRef.current.muted = !muted;
  //   }
  // };
  // Function to handle video download
  //   const handleDownload = (videoUrl:string) => {
  //     window.open(videoUrl, '_blank');
  //   };
  // Updated download function that works across devices
  // const handleDownload = async (videoUrl: string, prompt: string) => {
  //   try {
  //     // setDownloading(true);
  //     // setError('');

  //     // Validate URL
  //     if (!videoUrl.trim()) {
  //       throw new Error("Please enter a valid video URL");
  //     }

  //     // Create a hidden anchor element
  //     const link = document.createElement("a");
  //     link.href = videoUrl;

  //     // Set the download attribute with a filename
  //     const filename = prompt.split("/").pop() || "video";
  //     link.download = filename;

  //     // Add to document, click it, and remove it
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } catch (err) {
  //     // setError(err.message);
  //   } finally {
  //     // setDownloading(false);
  //   }
  // };

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        controls
        className="w-full rounded-lg"
        src={videoUrl}
        // muted={muted}
        // onEnded={() => setIsPlaying(false)}
      />
      {/* <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-4"> */}
      {/* <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={toggleMute}
          >
            {muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </Button> */}

      {/* <Button 
                    onClick={() => handleDownload(videoUrl,"prompt")}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Video
                  </Button> */}
      {/* </div> */}
    </div>
  );
};
