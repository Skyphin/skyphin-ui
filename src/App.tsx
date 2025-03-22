import { useEffect, useRef, useState } from "react";
import {
  ArrowBigDown,
  ArrowBigUp,
  Award,
  ChevronDown,
  Copy,
  Flag,
  MessageCircle,
} from "lucide-react";

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
    <div className="flex flex-col h-screen w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="px-3 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-small text-gray-800 line-clamp-1">
            {title}
          </h4>
        </div>
        <div className="flex items-center mt-1">
          <div className="text-xs text-gray-500 flex-1 truncate">{url}</div>
          <button
            className="ml-2 text-gray-400 hover:text-indigo-600 p-1 transition-colors"
            title="Copy URL"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>
      <div className="px-3 py-1 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center mt-1 text-gray-500">
          Sort by:
          <button className="flex items-center border-0 rounded-2xl p-1 px-2 gap-1 ml-2 text-gray-400 hover:text-zinc-100 hover:bg-gray-500 transition-colors">
            Best
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
      <div className="px-3 py-3 flex-1 flex-grow overflow-y-auto bg-gray-50">
        something
      </div>
      <div className="px-3 py-3 flex items-center gap-2 mt-auto bg-white border-t border-gray-100">
        <div className="flex items-center gap-1 ml-2 text-gray-400">
          <button
            className="flex items-center p-1 gap-1 hover:text-indigo-600 transition-colors"
            title="Upvote"
          >
            <ArrowBigUp size={25} />
          </button>
          <span>0</span>
          <button
            className="flex items-center p-1 hover:text-indigo-600 transition-colors"
            title="Downvote"
          >
            <ArrowBigDown size={25} />
          </button>
        </div>
        <button
          className="flex items-center p-1 gap-1 ml-2 text-gray-400 transition-colors"
          title="Comment"
        >
          <MessageCircle className="hover:text-indigo-600" size={20} />
          <span>0</span>
        </button>
        <button
          className="flex items-center p-1 gap-1 ml-2 text-gray-400 hover:text-indigo-600 transition-colors"
          title="Award"
        >
          <Award size={20} />
        </button>
        <button
          className="ml-auto p-1 text-gray-400 hover:text-red-700 transition-colors"
          title="Report"
        >
          <Flag size={14} />
        </button>
      </div>
    </div>
  );
}

export default App;
