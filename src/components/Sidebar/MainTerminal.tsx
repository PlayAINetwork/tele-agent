import {
  extractDate,
  LocalDateTimeDisplay,
  parseDataString,
  removeTimestamp,
} from "@/lib/utils";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const MainTerminal = () => {
  const [fullContentLoaded, setFullContentLoaded] = useState(false);
  const [logs, setLogs] = useState<any>([]);
  const [oldLogs, setOldlLogs] = useState<any>([]);
  // const [streamingLogs, setStreamingLogs] = useState<any>([]);

  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL("../../worker/eventSourceWorker.ts", import.meta.url),
      { type: "module" }
    );

    worker.onmessage = (e) => {
      console.log(e, "dsfd");
      const outerData = e.data;
      if (outerData?.data !== "thinking... analyzing") {
        if (oldLogs.length > 0) {
          // setStreamingLogs((pre: any) => [...pre, outerData]);
          setLogs((pre: any) => [...pre, outerData]);
        }
      }
    };

    worker.postMessage({
      url: `https://rogue-api.playai.network/logs`,
    });

    return () => {
      worker.terminate();
      setFullContentLoaded(false);
    };
  }, []);

  useEffect(() => {
    const fetchOldLoges = async () => {
      try {
        // setLoading(true);
        // setError(null);

        // Replace with your API endpoint
        const response = await axios.get(
          "https://rogue-api.playai.network/olderlogs"
        );
        response?.data?.map((item: any) => {
          // console.log(item);
          let outerData = item;
          const dataTrimmed = removeTimestamp(outerData?.data);
          outerData.dataunCut = outerData?.data;
          console.log(dataTrimmed);

          // if (outerData?.data !== "thinking... analyzing") {
          outerData.data = dataTrimmed;
          outerData.dataObj = parseDataString(dataTrimmed);
          // const newLogs = [...logs, outerData];

          setOldlLogs((pre: any) => [...pre, outerData]);
          setLogs((pre: any) => [...pre, outerData]);

          // }
        });
        // setOldlLogs(response?.data);
      } catch (err) {
        // setError(err.message || 'An error occurred while fetching data');
      } finally {
        // setLoading(false);
      }
    };

    fetchOldLoges();
  }, []);

  useEffect(() => {
    if (oldLogs.length > 0) {
      // setOldLogs();
      console.log(logs);
    }
  }, [oldLogs]);

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
    const handleScroll = () => {
      if (terminalRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
        if (isAtBottom && !fullContentLoaded) {
          setFullContentLoaded(true);
        }
      }
    };

    const currentRef = terminalRef.current;
    currentRef?.addEventListener("scroll", handleScroll);
    return () => currentRef?.removeEventListener("scroll", handleScroll);
  }, [logs, fullContentLoaded]);

  if (logs.length < 1) {
    return (
      <div className="grid place-items-center gap-2 rounded-md  uppercase text-[rgb(248 134 88)] bg-[#2F3636] h-full">
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
    <div className="flex flex-col  gap-4 h-full ">
      <div
        className="flex-1  leading-5 relative bg-[#2F3636] rounded-md p-4 overflow-auto h-full "
        ref={terminalRef}
        style={{
          fontFamily: "'VT323', monospace",
        }}
      >
        {/* {!fullContentLoaded ? (
          <p className="fixed bottom-[-100px] right-0 rounded-lg bg-[#EE4B4B] p-2 px-4 text-white z-10">
            Loading logs . . .
          </p>
        ) : null} */}
        {/* {displayedLogs.length < logs.length && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mx-auto mb-4 px-6 py-2 bg-[#EE4B4B] text-white rounded-lg hover:bg-[#D43B3B] disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )} */}
        {logs?.map((log: any, index: number) => (
          <div
            key={index + log?.taskId}
            // className="grid grid-cols-[235px_1fr] gap-1"
          >
            <div
              style={{ whiteSpace: "pre-line" }}
              className="h-auto break-all  pb-10 text-sm font-thin leading-5 "
            >
              <strong>
                {/* <span style={{ color: "rgb(134 217 97)" }}>Task Name :</span>{" "} */}
                {LocalDateTimeDisplay(extractDate(log?.dataunCut))}
              </strong>
              <br />
              <strong>
                <span style={{ color: "rgb(134 217 97)" }}>Task Name :</span>{" "}
                {log?.taskName}
              </strong>
              <br />
              <strong>
                <span style={{ color: "rgb(248 134 88)" }}>TaskID :</span>{" "}
                {log?.taskId}
              </strong>
              <br />
              {log?.dataObj?.user ? (
                <>
                  <strong>
                    <span
                      className="uppercase"
                      style={{ color: "rgb(134 217 97)" }}
                    >
                      user :
                    </span>{" "}
                    {log?.dataObj?.user}
                  </strong>
                  <br />

                  <strong>
                    <span
                      className="uppercase"
                      style={{ color: "rgb(134 217 97)" }}
                    >
                      action :
                    </span>{" "}
                    {log?.dataObj?.action}
                  </strong>
                  <br />
                  <strong>
                    <span
                      className="uppercase"
                      style={{ color: "rgb(255 240 153)" }}
                    >
                      inReplyTo :
                    </span>{" "}
                    {log?.dataObj?.inReplyTo}
                  </strong>
                  <br />
                  <span>
                    <strong
                      className="uppercase"
                      style={{ color: "rgb(134 217 97)" }}
                    >
                      text :
                    </strong>{" "}
                    {log?.dataObj?.text}
                  </span>
                  <br />
                </>
              ) : null}

              {log?.dataObj?.user
                ? null
                : log?.data?.split("\n").map((line: any, lineIndex: any) => (
                    <React.Fragment key={lineIndex}>
                      {line.split(" ").map((word: any, wordIndex: any) => (
                        <React.Fragment key={wordIndex}>
                          {word?.endsWith(":") ? (
                            <strong
                              className=" leading-4 font-700 uppercase"
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
                  ))}
              {/* { <div>{log.data}</div>} */}
            </div>
          </div>
        ))}

        <div className="flex">
          <div className=" pb-8  text-xs">
            {"</>"}
            <span className="ml-2 w-1 min-w-1 animate-[pulse_400ms_cubic-bezier(0.4,_0,_0.6,_1)_infinite] bg-white duration-1000">
              |
            </span>
          </div>
        </div>
        {/* last element
        <div className="flex h-full">
          <p className="w-[115px] min-w-[115px] whitespace-nowrap border-r pl-4 text-center text-[#FAFAFA66] lg:w-[196px] lg:min-w-[196px]"></p>
          <div className="h-[200px] min-h-[200px]"></div>
        </div> */}
      </div>
    </div>
  );
};

export default MainTerminal;
