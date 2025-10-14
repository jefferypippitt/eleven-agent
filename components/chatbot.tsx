"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ui/conversation";
import { ConversationBar } from "@/components/ui/conversation-bar";
import { Message, MessageContent } from "@/components/ui/message";
import { Orb } from "@/components/ui/orb";
import { Response } from "@/components/ui/response";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/chat");
        if (!response.ok) {
          throw new Error("Failed to fetch configuration");
        }
        const data = await response.json();
        setAgentId(data.agentId);
      } catch (error) {
        console.error("Failed to load configuration:", error);
      }
    };
    fetchConfig();
  }, []);

  if (!agentId) {
    return null;
  }

  return (
    <Card className="flex h-[calc(100vh-280px)] w-full max-w-4xl mx-auto flex-col">
      <CardContent className="relative flex-1 overflow-hidden p-0">
        <Conversation className="absolute inset-0 pb-[88px]">
          <ConversationContent className="flex min-w-0 flex-col gap-2 p-6 pb-6">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<Orb className="size-20" />}
                title="Start a conversation"
                description="Tap the phone button"
              />
            ) : (
              messages.map((message, index) => {
                return (
                  <div key={index} className="flex w-full flex-col gap-1">
                    <Message from={message.role}>
                      <MessageContent className="max-w-full min-w-0">
                        <Response className="w-auto [overflow-wrap:anywhere] whitespace-pre-wrap">
                          {message.content}
                        </Response>
                      </MessageContent>
                      {message.role === "assistant" && (
                        <div className="ring-border size-6 flex-shrink-0 self-end overflow-hidden rounded-full ring-1">
                          <Orb className="h-full w-full" />
                        </div>
                      )}
                    </Message>
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className={cn(
                                  "text-muted-foreground hover:text-foreground relative size-9 p-1.5"
                                )}
                                size="sm"
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    message.content
                                  );
                                  setCopiedIndex(index);
                                  setTimeout(() => setCopiedIndex(null), 2000);
                                }}
                              >
                                {copiedIndex === index ? (
                                  <CheckIcon className="size-4" />
                                ) : (
                                  <CopyIcon className="size-4" />
                                )}
                                <span className="sr-only">
                                  {copiedIndex === index ? "Copied!" : "Copy"}
                                </span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {copiedIndex === index ? "Copied!" : "Copy"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </ConversationContent>
          <ConversationScrollButton className="bottom-[100px]" />
        </Conversation>
        <div className="absolute right-0 bottom-0 left-0 flex justify-center">
          <ConversationBar
            className="w-full max-w-2xl"
            agentId={agentId}
            onConnect={() => setMessages([])}
            onDisconnect={() => setMessages([])}
            onSendMessage={(message) => {
              const userMessage: ChatMessage = {
                role: "user",
                content: message,
              };
              setMessages((prev) => [...prev, userMessage]);
            }}
            onMessage={(message) => {
              const newMessage: ChatMessage = {
                role: message.source === "user" ? "user" : "assistant",
                content: message.message,
              };
              setMessages((prev) => [...prev, newMessage]);
            }}
            onError={(error) => console.error("Conversation error:", error)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
