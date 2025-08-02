import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useTodos } from "@/contexts/TodoContext";
import { host } from "@/cofig";
import { useAuth } from "@/contexts/AuthContext";
import ReactMarkdown from "react-markdown";

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ text: string; isBot: boolean }>
  >([
    {
      text: "Hi! I'm your TaskFlow assistant. How can I help you today?",
      isBot: true,
    },
  ]);
  const { user } = useAuth();
  const { todos } = useTodos();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${host}/v1/llm/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
        body: JSON.stringify({
          todoList: todos,
          chats: [
            ...messages.map((msg) => ({
              isHuman: !msg.isBot,
              text: msg.text,
            })),
            { isHuman: true, text: userMessage },
          ].slice(-5),
        }),
      });

      const json = await response.json();
      const content = json?.data || "Sorry, cannot process that.";
      setMessages((prev) => [...prev, { text: content, isBot: true }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { text: "Error: Unable to reach server.", isBot: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Bot Icon */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-accent hover:shadow-xl z-40"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 glass-morphism rounded-2xl shadow-2xl border border-border/50 z-50 flex flex-col animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-sm">TaskFlow Assistant</h3>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.isBot
                      ? "bg-accent/20 text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-accent/20 p-3 rounded-lg text-sm text-muted-foreground animate-pulse">
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/30">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="glass-morphism border-border/50 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                variant="gradient"
                className="shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
