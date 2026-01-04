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
import { ChatStorageService } from "./services/chatStorage";
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
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  // Load chat history when tab changes
  useEffect(() => {
    async function loadHistory() {
      // Prevent saving while loading new tab data
      setIsHistoryLoaded(false);

      if (tabId !== apiRef.current.tabs.TAB_ID_NONE) {
        const history = await ChatStorageService.loadMessages(tabId);
        setMessages(history);
      } else {
        setMessages([]);
      }

      // Allow saving again
      setIsHistoryLoaded(true);
    }
    loadHistory();
  }, [tabId]);

  // Save chat history when messages change
  useEffect(() => {
    if (isHistoryLoaded && tabId !== apiRef.current.tabs.TAB_ID_NONE) {
      ChatStorageService.saveMessages(tabId, messages);
    }
  }, [messages, tabId, isHistoryLoaded]);

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
      const token = user ? await user.getIdToken() : undefined;

      // Create a placeholder agent message immediately
      const agentMsgId = uuidv4();
      const initialAgentMsg: Message = {
        id: agentMsgId,
        role: "agent",
        content: "",
        type: "text",
        metadata: {
          steps: []
        }
      };
      setMessages((prev) => [...prev, initialAgentMsg]);

      await AgentService.processQuery(text, (content: string, type: any, metadata: any) => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const msgIndex = newMessages.findIndex(m => m.id === agentMsgId);
          if (msgIndex === -1) return prev;

          const msg = { ...newMessages[msgIndex] };

          // Logic for different event types
          if (type === "thinking" || type === "action") {
            const step: any = {
              id: uuidv4(),
              type: type,
              content: content,
              status: "completed",
              metadata: metadata
            };
            msg.metadata = {
              ...msg.metadata,
              steps: [...(msg.metadata?.steps || []), step]
            };
          } else if (type === "text") {
            // Append text to the main content
            msg.content = (msg.content || "") + content;
          }

          newMessages[msgIndex] = msg;
          return newMessages;
        });
      }, token);
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

  const handleClearHistory = async () => {
    if (tabId !== apiRef.current.tabs.TAB_ID_NONE) {
      await ChatStorageService.clearMessages(tabId);
      setMessages([]);
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
      <Heading onClear={handleClearHistory} />
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
