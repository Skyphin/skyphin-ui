import { useEffect, useRef, useState } from "react";
import "./App.css";

/* eslint-disable @typescript-eslint/no-explicit-any */
function App() {
  const apiRef = useRef(typeof browser !== "undefined" ? browser : chrome);
  const [tabId, setTabId] = useState(apiRef.current.tabs.TAB_ID_NONE);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!(window as any).__EXTENSION_LOADED__) {
      (window as any).__EXTENSION_LOADED__ = true;
      (apiRef.current as typeof chrome).runtime.sendMessage({
        event: "EXTENSION_OPENED",
      });
    }
  }, []);

  useEffect(() => {
    function updateTitleAndUrl(tab: any) {
      setTitle(tab?.title ?? "");
      setUrl(tab?.url ?? "");
    }
    function handleMessage(message: any) {
      console.log("Message Info:", message);
      if (message.type === "TAB_UPDATED") {
        if (message.tab?.id === tabId) {
          updateTitleAndUrl(message.tab);
        }
      } else if (
        message.type === "TAB_INITIATED" ||
        message.type === "TAB_CHANGED"
      ) {
        setTabId(message.tab?.id ?? apiRef.current.tabs.TAB_ID_NONE);
        updateTitleAndUrl(message.tab);
      }
    }
    const currentApiRef = apiRef.current;
    currentApiRef.runtime.onMessage.addListener(handleMessage);
    return () => {
      currentApiRef.runtime.onMessage.removeListener(handleMessage);
    };
  }, [tabId]);

  return (
    <div className="App">
      {title}
      <br />
      {url}
    </div>
  );
}

export default App;
