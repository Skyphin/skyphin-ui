import { useEffect, useRef, useState } from "react";
import Heading from "./components/Heading";
import ActionPanel from "./components/ActionPanel";
import { Layout } from "./components/Layout";
import CommentsFilter from "./components/comments/CommentsFilter";
import Comments from "./components/comments/Comments";
import { useUrl } from "./hooks/useUrl";

/* eslint-disable @typescript-eslint/no-explicit-any */
function App() {
  const apiRef = useRef(typeof browser !== "undefined" ? browser : chrome);
  const [tabId, setTabId] = useState(apiRef.current.tabs.TAB_ID_NONE);
  const { setTitleAndUrl } = useUrl();

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
      setTitleAndUrl({ title: tab?.title ?? "", url: tab?.url ?? "" });
    }
    function handleMessage(message: any) {
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
  }, [tabId, setTitleAndUrl]);

  return (
    <Layout>
      <Heading />
      <CommentsFilter />
      <Comments />
      <ActionPanel />
    </Layout>
  );
}

export default App;
