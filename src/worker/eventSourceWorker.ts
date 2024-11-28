// eventSourceWorker.js

import { parseDataString, removeTimestamp } from "@/lib/utils";

// eventSourceWorker.js

// This listens for messages from the main thread to start the EventSource
self.onmessage = (e) => {
  const { url } = e.data;

  // Set up EventSource connection
  const eventSource = new EventSource(url);

  // Listen for messages from the server
  eventSource.onmessage = (event) => {
    let outerData = event.data ? JSON.parse(event.data) : {};
    const dataTrimmed = removeTimestamp(outerData?.data);
    outerData.dataunCut = outerData?.data;
    if (outerData?.data !== "thinking... analyzing") {
      outerData.dataObj = parseDataString(dataTrimmed);
      outerData.data = dataTrimmed;
    }
    // Post the data back to the main thread
    self.postMessage(outerData);
  };

  // Close the EventSource when the worker is terminated
  self.onclose = () => {
    console.log("close");
    eventSource.close();
  };
};
