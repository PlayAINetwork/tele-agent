import { VideoPlayer } from "@/components/Sidebar/GenerateVedio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { truncateText } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminGenrate = () => {
  const [prompt, setPrompt] = useState("");
  const [disableAction, setDisableAction] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [videoGeneraing, setVideoGeneraing] = useState(false);
  const { toast } = useToast();
  const [recentlist, setRecentlist] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        "https://render-video.agentexperience.live/get-all-files-in-bucket"
      );
      const filteredData = response?.data.filter(
        (item: any) => item[3] === "0x"
      );
      setRecentlist(filteredData.reverse());
    })();
  }, [disableAction]);

  const generateVideo = async () => {
    if (prompt === "") {
      toast({
        title: "Enter your Topic",
      });
      return false;
    }
    try {
      setStatus("Generating Video...");

      setVideoGeneraing(true);
      setDisableAction(true);

      const response = await axios.post(
        "https://render-video.agentexperience.live/generate",

        // "https://render.dhanush29.me/generate",
        { prompt: prompt, wallet: "0x" },
        {
          headers: {
            "Content-Type": "application/json",
            admin: "J+Mgog#JDDP#",
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
        toast({
          title: " Creation is successufll",
        });

        // console.log(confirmation);

        //   setStatus("Transfer successful! Signature: " + signature);
        setVideoGeneraing(false);
        setPrompt("");
        setDisableAction(false);
      }
    } catch (error) {
      setVideoGeneraing(false);
      setDisableAction(false);
    }
  };

  return (
    <div className=" max-w-[500px] mx-auto   flex flex-col gap-4  h-full justify-between overflow-auto ">
      <div className="flex flex-col gap-2">
        <Textarea
          disabled={disableAction}
          className="h-[100px] rounded-lg  placeholder-white"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt to create video"
        />

        <Button
          className="w-full uppercase rounded-[40px]"
          onClick={generateVideo}
          disabled={videoGeneraing || disableAction}
        >
          {videoGeneraing
            ? status || "Generating Video..."
            : `Generate`}
        </Button>
      </div>

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
                    className={`w-[48%]  max-h-[100px] cursor-pointer   relative rounded-md overflow-hidden`}
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
      </div>
    </div>
  );
};

export default AdminGenrate;
