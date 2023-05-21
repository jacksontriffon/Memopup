import { type KeyboardEventHandler, useState, useEffect } from "react";
import { api } from "~/utils/api";
import ChatMessage from "./ChatMessage";
import { useSession } from "next-auth/react";
import { type Chat, type Message } from "@prisma/client";
import ChatInput from "./ChatInput/ChatInput";
import { type Atom, useAtom } from "jotai";

interface ChatProps {
  storedChatIDAtom: Atom<string>;
}

export default function Chat(props: ChatProps) {
  const { storedChatIDAtom } = props;
  const [storedChatID, setStoredChatID] = useAtom(storedChatIDAtom);

  const [chatData, setChatData] = useState<Chat | undefined>(undefined);
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
  const { data: newChatData } = api.chat.getChatFromID.useQuery(
    {
      chatId: storedChatID,
    },
    {
      enabled: storedChatID !== chatData?.id,
      onSuccess: (newChat) => newChat && setChatData(newChat),
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

  const getTitleFromMessage = api.openai.getChatTitle.useMutation();

  const [messages, setMessages] = useState<Message[]>(chatMessages ?? []);
  const [state, setState] = useState<"default" | "loading" | "error">(
    "default"
  );

  const sendMessage = async (text: string) => {
    if (!chatData) {
      try {
        const chatTitleResponse = await getTitleFromMessage.mutateAsync({
          message: text,
          aiModel: "ChatGPT",
        });
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
        } else {
          // Couldn't generate a title
          console.error(
            "Memopup went blank, he couldn't think of a chat title..."
          );
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
    <div className="bottom-0 max-h-full w-full">
      <div className=" flex flex-col gap-2 px-4">
        {messages?.map((message, index) => {
          return (
            <ChatMessage
              key={index}
              {...message}
              showSenderName={true}
              showUpdatedAt={true}
              loading={false}
            />
          );
        })}
        {state === "loading" && (
          <div className="chat chat-end">
            <div className="chat-bubble flex items-center justify-center bg-base-200">
              <svg
                aria-hidden="true"
                className="mr-2 h-4 w-4 animate-spin fill-base-100 text-base-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
      <ChatInput onKeyDown={handleKeyDown} />
    </div>
  );
}
