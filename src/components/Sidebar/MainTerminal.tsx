import React, { useEffect, useState } from "react";

const MainTerminal = () => {
  // const [fullContentLoaded, setFullContentLoaded] = useState(false);
  const [logs, setLogs] = useState<any>([]);

  useEffect(() => {
    const worker = new Worker(
      new URL("../worker/eventSourceWorker.ts", import.meta.url),
      { type: "module" }
    );

    worker.onmessage = (e) => {
      const outerData = e.data;

      if (outerData?.data !== "thinking... analyzing") {
        setLogs((prevLogs: any) => [...prevLogs, outerData]);
      }
    };

    worker.postMessage({
      url: `https://rogue-api.playai.network/logs?page=${1}&limit=${10}`,
    });

    return () => {
      worker.terminate();
      // setFullContentLoaded(false);
    };
  }, []);
  return (
    <div className="flex flex-col  gap-4 h-full">
      <div className="flex-1 bg-muted p-4">
        {logs?.map((log: any, index: number) => (
          <div
            key={index + log?.taskId}
            className="grid grid-cols-[235px_1fr] gap-1"
          >
       
            <div
              style={{ whiteSpace: "pre-line" }}
              className="h-auto break-all px-4 pb-10"
            >
              <strong style={{ color: "#000" }}>
                <span style={{ color: "rgb(134 217 97)" }}>Task Name :</span>{" "}
                {log?.taskName}
              </strong>
              <br />
              <strong style={{ color: "#000" }}>
                <span style={{ color: "rgb(248 134 88)" }}>TaskID :</span>{" "}
                {/* {trimWords(log?.taskId, 4)} */}
              </strong>
              <br />
              {log?.dataObj?.user ? (
                <>
                  <strong style={{ color: "#000" }}>
                    <span style={{ color: "rgb(134 217 97)" }}>user :</span>{" "}
                    {log?.dataObj?.user}
                  </strong>
                  <br />

                  <strong style={{ color: "#000" }}>
                    <span style={{ color: "rgb(134 217 97)" }}>action :</span>{" "}
                    {log?.dataObj?.action}
                  </strong>
                  <br />
                  <strong style={{ color: "#000" }}>
                    <span style={{ color: "rgb(255 240 153)" }}>
                      inReplyTo :
                    </span>{" "}
                    {log?.dataObj?.inReplyTo}
                  </strong>
                  <br />
                  <span style={{ color: "#000" }}>
                    <strong style={{ color: "rgb(134 217 97)" }}>text :</strong>{" "}
                    {log?.dataObj?.text}
                  </span>
                  <br />
                </>
              ) : null}

              {log?.dataObj?.user
                ? null
                : log?.data.split("\n").map((line: any, lineIndex: any) => (
                    <React.Fragment key={lineIndex}>
                      {line.split(" ").map((word: any, wordIndex: any) => (
                        <React.Fragment key={wordIndex}>
                          {word.endsWith(":") ? (
                            <strong
                              className="font-700"
                              style={{ color: "rgb(134, 217, 97)" }}
                            >
                              {word}
                            </strong>
                          ) : (
                            <span style={{ color: "#000" }}>{word}</span>
                          )}{" "}
                        </React.Fragment>
                      ))}
                      <br />
                    </React.Fragment>
                  ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainTerminal;
