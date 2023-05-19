import { type KeyboardEventHandler, useState, useRef } from "react";
import Button from "./Button";
import Input from "./Input";
import { api } from "~/utils/api";
import ChatMessage from "./ChatMessage";
import { useSession } from "next-auth/react";
import { type Chat, type Message } from "@prisma/client";

async function getGeneratedChatTitleFromMessage(
  message: string
): Promise<{ title: string }> {
  const response = await fetch("/api/gpt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate chat title");
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: { title: string } = await response.json();
  return data;
}

interface ChatProps {
  defaultChatData?: Chat;
}

const generateChatTitle = async (message: string) => {
  try {
    const response = await getGeneratedChatTitleFromMessage(message);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};

export default function Chat(props: ChatProps) {
  const { defaultChatData } = props;
  const [chatData, setChatData] = useState<Chat | undefined>(defaultChatData);
  const { data: sessionData } = useSession();
  const { data: chatMessages, refetch: refetchMessages } =
    api.chat.getChatMessages.useQuery(
      {
        chatId: chatData?.id ?? "",
      },
      {
        enabled: sessionData?.user !== undefined,
        onSuccess: (currentChatMessages) => {
          setMessages(currentChatMessages);
        },
        onError: (err) => {
          setState("error");
          console.error(err);
        },
      }
    );
  const createMessage = api.chat.createMessage.useMutation({
    onSuccess: (newMessage) => {
      void refetchMessages();
      setMessages([...messages, newMessage]);
      setState("default");
    },
    onError: (err) => {
      setState("error");
      console.error(err);
    },
  });
  const createChat = api.chat.createChat.useMutation({
    onSuccess: (newChat) => {
      setChatData(newChat);
    },
    onError: (err) => {
      setState("error");
      console.error(err);
    },
  });

  const [messages, setMessages] = useState<Message[]>(chatMessages ?? []);
  const [state, setState] = useState<"default" | "loading" | "error">(
    "default"
  );

  const sendMessage = async (text: string) => {
    if (!chatData) {
      try {
        const chatTitleResponse = await generateChatTitle(text);
        const generatedTitle = chatTitleResponse?.title;

        if (generatedTitle) {
          const chat = await createChat.mutateAsync({
            title: generatedTitle,
            aiModel: "ChatGPT",
          });
          const message = await createMessage.mutateAsync({
            content: text,
            chatId: chat.id,
            senderName: sessionData?.user.name ?? "",
          });
          console.log(message, "| After new chat");
        }
      } catch (error) {
        console.error("Error:", error);
        return;
      }
    } else {
      const message = await createMessage.mutateAsync({
        content: text,
        chatId: chatData?.id,
        senderName: sessionData?.user.name ?? "",
      });
      console.log(message, "| existing chat");
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      void sendMessage(event.currentTarget.value);
      setState("loading");
      event.currentTarget.value = "";
    }
  };

  return (
    <div className="bottom-0 w-full ">
      <div className="flex flex-col gap-2 overflow-auto px-4">
        {messages?.map((message, index) => {
          // Previous message is from same person
          // if (messages[index - 1]?.senderName === message.senderName) {
          //   return (
          //     <ChatMessage
          //       key={index}
          //       {...message}
          //       showSenderName={false}
          //       showUpdatedAt={true}
          //     />
          //   );
          // } else {
          return (
            <ChatMessage
              key={index}
              {...message}
              showSenderName={true}
              showUpdatedAt={true}
            />
          );
          // }
        })}
      </div>
      <div className="sticky bottom-0 bg-base-100 px-4 pb-4 transition-all">
        <div className="flex flex-col gap-2 px-4 pb-4">
          <h3 className="text-lg font-bold text-neutral">Saved Prompts</h3>
          <div className="flex max-w-full flex-wrap gap-2">
            {/* <Button togglable>Translate</Button> */}
            {/* <Button togglable>🎶 Poem 🎶</Button> */}
            <Button modalId="prompt-modal">+ New Prompt?</Button>
          </div>
        </div>
        <Input
          aria-invalid={state === "error"}
          disabled={state === "loading"}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
