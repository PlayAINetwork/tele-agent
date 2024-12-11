import {
  extractDate,
  LocalDateTimeDisplay,
  parseDataString,
  removeTimestamp,
} from "@/lib/utils";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const MainTerminal = () => {
  const textToRemove =
    'Response format should be formatted in a JSON block like this:\n```json\n{ "user": "rogue", "text": string, "action": string }\n```';

  const [logs, setLogs] = useState<any>([]);
  // const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  // const [currentTypingText, setCurrentTypingText] = useState("");
  // const [isTyping, setIsTyping] = useState(false);
  const [stringInQueue, setStringInQueue] = useState<any>([]);
  // Maximum time to complete typing (in milliseconds)
  // const MAX_TYPING_DURATION = 20000;

  // Calculate dynamic typing speed based on text length
  // const calculateTypingSpeed = (text: string): number => {
  //   const baseSpeed = 10; // Minimum speed for very short texts
  //   const textLength = text.length;

  //   // Calculate speed to complete within MAX_TYPING_DURATION
  //   let speed = MAX_TYPING_DURATION / textLength;

  //   // Add variation to make it feel more natural
  //   const variation = 0.5; // 50% variation
  //   const randomFactor = 1 - variation + Math.random() * variation * 2;
  //   speed *= randomFactor;

  //   // Ensure speed doesn't go below baseSpeed
  //   return Math.max(speed, baseSpeed);
  // };

  // Add natural pauses for punctuation and special characters
  // const getCharacterDelay = (char: string, baseSpeed: number): number => {
  //   const delays = {
  //     ".": 4,
  //     "!": 4,
  //     "?": 4,
  //     ",": 2,
  //     ":": 2,
  //     ";": 2,
  //     "\n": 3,
  //   };
  //   return baseSpeed * (delays[char as keyof typeof delays] || 1);
  // };

  useEffect(() => {
    const fetchOldLogs = async () => {
      try {
        const response = await axios.get(
          "https://rogue-api.playai.network/olderlogs?page=1&limit=10"
        );
        response?.data?.map((item: any) => {
          let outerData = item;
          outerData.data = outerData.data.replace(textToRemove, "").trim();
          const dataTrimmed = removeTimestamp(outerData?.data);
          outerData.dataunCut = outerData?.data;
          outerData.data = dataTrimmed;
          outerData.dataObj = parseDataString(dataTrimmed);
          setLogs((pre: any) => [...pre, outerData]);
          setStringInQueue((pre: any) => [...pre, outerData]);
        });
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };

    fetchOldLogs();
  }, []);

  useEffect(() => {
    const worker = new Worker(
      new URL("../../worker/eventSourceWorker.ts", import.meta.url),
      { type: "module" }
    );

    worker.onmessage = (e) => {
      let outerData = e.data;
      outerData.data = outerData.data.replace(textToRemove, "").trim();
      const dataTrimmed = removeTimestamp(outerData?.data);
      outerData.dataunCut = outerData?.data;
      outerData.data = dataTrimmed;
      outerData.dataObj = parseDataString(dataTrimmed);
      setLogs((pre: any) => [...pre, outerData]);
    };

    worker.postMessage({
      url: `https://rogue-api.playai.network/logs`,
    });

    return () => {
      worker.terminate();
    };
  }, []);

  // Enhanced typing effect with dynamic speed
  // useEffect(() => {
  //   if (logs.length > 0) {
  //     const lastLog = logs[logs.length - 1];
  //     const text = lastLog?.data || "";

  //     if (text && !isTyping) {
  //       setIsTyping(true);
  //       setCurrentTypingText("");

  //       let currentIndex = 0;
  //       const baseSpeed = calculateTypingSpeed(text);
  //       let startTime = Date.now();

  //       const typeNextCharacter = () => {
  //         if (currentIndex < text.length) {
  //           setCurrentTypingText((prev) => prev + text[currentIndex]);
  //           currentIndex++;

  //           // Calculate remaining time and adjust speed if needed
  //           const elapsedTime = Date.now() - startTime;
  //           const remainingChars = text.length - currentIndex;
  //           const remainingTime = MAX_TYPING_DURATION - elapsedTime;
  //           const adjustedSpeed = remainingTime / remainingChars;

  //           // Get delay for current character
  //           const currentChar = text[currentIndex] || "";
  //           const delay = getCharacterDelay(
  //             currentChar,
  //             Math.min(baseSpeed, adjustedSpeed)
  //           );

  //           setTimeout(typeNextCharacter, delay);
  //         } else {
  //           setIsTyping(false);
  //           if (terminalRef.current) {
  //             terminalRef.current.scrollTo({
  //               top: terminalRef.current.scrollHeight,
  //               behavior: "smooth",
  //             });
  //           }
  //         }
  //       };

  //       typeNextCharacter();
  //     }
  //   }
  // }, [logs]);

  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  // Example text to type
  const currentObj = stringInQueue[0] || "";
  const currentString = currentObj?.data || "";

  useEffect(() => {
    // If no strings in queue or typing is complete, return
    if (stringInQueue.length === 0 || isTypingComplete) return;

    // Type the current character
    if (currentIndex < currentString.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + currentString[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 50); // Adjust typing speed here

      return () => clearTimeout(timeout);
    } else {
      // Typing is complete for current string
      setIsTypingComplete(true);

      // Move string from queue to logs
      setTimeout(() => {
        // setLogs(prevLogs => ({
        //   data: [...prevLogs.data, currentString]
        // }));
        setLogs((pre: any) => [...pre, currentObj]);
        // Remove the processed string from queue
        setStringInQueue((prev: any) => prev.slice(1));

        // Reset for next string
        setCurrentText("");
        setCurrentIndex(0);
        setIsTypingComplete(false);
      }, 500); // Delay before processing next string
    }
  }, [currentIndex, currentString, stringInQueue, isTypingComplete]);

  // const addToQueue = (newLog) => {
  //   setStringInQueue(prev => [...prev, newLog]);
  // };

  const LogEntry = ({ log }: { log: any; index?: number }) => (
    <div
      style={{ whiteSpace: "pre-line" }}
      className="h-auto break-all pb-10 text-sm font-thin leading-5"
    >
      <strong>{LocalDateTimeDisplay(extractDate(log?.dataunCut))}</strong>
      <br />
      <strong>
        <span style={{ color: "rgb(134 217 97)" }}>Task Name :</span>{" "}
        {log?.taskName}
      </strong>
      <br />
      <strong>
        <span style={{ color: "rgb(248 134 88)" }}>TaskID :</span> {log?.taskId}
      </strong>
      <br />
      {log?.dataObj?.user ? (
        <>
          <br />
          <span>
            <strong className="uppercase" style={{ color: "rgb(134 217 97)" }}>
              text :
            </strong>{" "}
            {log?.dataObj?.text}
          </span>
          <br />
        </>
      ) : (
        // : index === logs.length - 1 ? (
        //   currentTypingText.split("\n").map((line: any, lineIndex: any) => (
        //     <React.Fragment key={lineIndex}>
        //       {line.split(" ").map((word: any, wordIndex: any) => (
        //         <React.Fragment key={wordIndex}>
        //           {word?.endsWith(":") ? (
        //             <strong
        //               className="leading-4 font-700 uppercase"
        //               style={{ color: "rgb(134, 217, 97)" }}
        //             >
        //               {word}
        //             </strong>
        //           ) : word?.startsWith("@") ? (
        //             <span
        //               className="font-700 leading-4"
        //               style={{ color: "#8AC1B1" }}
        //             >
        //               {word}
        //             </span>
        //           ) : (
        //             <span className="leading-4">{word}</span>
        //           )}{" "}
        //         </React.Fragment>
        //       ))}
        //       <br />
        //     </React.Fragment>
        //   ))
        // )
        log.data?.split("\n").map((line: any, lineIndex: any) => (
          <React.Fragment key={lineIndex}>
            {line.split(" ").map((word: any, wordIndex: any) => (
              <React.Fragment key={wordIndex}>
                {word?.endsWith(":") ? (
                  <strong
                    className="leading-4 font-700 uppercase"
                    style={{ color: "rgb(134, 217, 97)" }}
                  >
                    {word}
                  </strong>
                ) : word?.startsWith("@") ? (
                  <span
                    className="font-700 leading-4"
                    style={{ color: "#8AC1B1" }}
                  >
                    {word}
                  </span>
                ) : (
                  <span className="leading-4">{word}</span>
                )}{" "}
              </React.Fragment>
            ))}
            <br />
          </React.Fragment>
        ))
      )}
    </div>
  );

  if (logs?.length < 1) {
    return (
      <div className="grid place-items-center gap-2 rounded-md uppercase text-[rgb(248 134 88)] bg-[#2F3636] h-full">
        <div className="height-fit grid gap-2">
          <p className="text-lg font-medium">Loading Terminal . . .</p>
          <div className="grid w-[300px] animate-pulse gap-2">
            <div className="h-4 w-3/4 rounded bg-foreground"></div>
            <div className="h-4 w-1/2 rounded bg-foreground"></div>
            <div className="h-4 w-2/3 rounded bg-foreground"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div
        className="flex-1 leading-5 relative bg-[#2F3636] rounded-md p-4 overflow-auto h-full"
        ref={terminalRef}
        style={{
          fontFamily: "'VT323', monospace",
        }}
      >
        {logs?.map((log: any, index: number) => (
          <LogEntry key={index + log?.taskId} log={log} />
        ))}
        {stringInQueue.length > 0 && (
          <pre className="whitespace-pre-wrap">
            {currentText}
            <span className="animate-pulse">▋</span>
          </pre>
        )}
        <div className="flex">
          <div className="pb-8 text-xs">
            {"</>"}
            <span className="ml-2 w-1 min-w-1 animate-[pulse_400ms_cubic-bezier(0.4,_0,_0.6,_1)_infinite] bg-white duration-1000">
              |
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainTerminal;
