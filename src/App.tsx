import { useEffect, useRef, useState } from "react";
import ConnectedHeading from "./components/Heading";
import { useDispatch } from "react-redux";
import { setTitleAndUrl } from "./store/slices/url.slice";
import ConnectedActionPanel from "./components/ActionPanel";
import { Layout } from "./components/Layout";
import ConnectedCommentsFilter from "./components/comments/CommentsFilter";
import ConnectedComments from "./components/comments/Comments";

/* eslint-disable @typescript-eslint/no-explicit-any */
function App() {
  const apiRef = useRef(typeof browser !== "undefined" ? browser : chrome);
  const [tabId, setTabId] = useState(apiRef.current.tabs.TAB_ID_NONE);
  const dispatch = useDispatch();

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
      dispatch(
        setTitleAndUrl({ title: tab?.title ?? "", url: tab?.url ?? "" })
      );
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
  }, [tabId, dispatch]);

  return (
    <Layout>
      <ConnectedHeading />
      <ConnectedCommentsFilter />
      <ConnectedComments />
      <ConnectedActionPanel />
    </Layout>
  );
}

export default App;
