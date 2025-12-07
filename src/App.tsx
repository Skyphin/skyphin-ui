import { useEffect, useRef, useState } from "react";
import Heading from "./components/Heading";
import { Layout } from "./components/Layout";
import { useUrl } from "./hooks/useUrl";
import { ContentBody } from "./components/ContentBody";
import { ActionPanel } from "./components/ActionPanel";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./components/auth/LoginPage";
import { Message } from "./components/chat/ChatInterface";
import { AgentService } from "./services/agent";
import { v4 as uuidv4 } from "uuid";

/* eslint-disable @typescript-eslint/no-explicit-any */
function MainApp() {
  const apiRef = useRef(typeof browser !== "undefined" ? browser : chrome);
  const [tabId, setTabId] = useState(apiRef.current.tabs.TAB_ID_NONE);
  const { setTabPropertis } = useUrl();
  const { user, isLoading } = useAuth();

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAgentProcessing, setIsAgentProcessing] = useState(false);

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
      setTabPropertis(tab);
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
  }, [tabId, setTabPropertis]);

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: uuidv4(),
      role: "user",
      content: text,
      type: "text",
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsAgentProcessing(true);

    try {
      await AgentService.processQuery(text, (content, type, metadata) => {
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            role: "agent",
            content,
            type,
            metadata,
          },
        ]);
      });
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "agent",
          content: "Sorry, I encountered an error.",
          type: "text"
        }
      ])
    } finally {
      setIsAgentProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen dark:bg-zinc-900 dark:text-white">Loading...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Heading />
      <ContentBody messages={messages} />
      <ActionPanel onSendMessage={handleSendMessage} isLoading={isAgentProcessing} />
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
