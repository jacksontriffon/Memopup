import { type KeyboardEventHandler, useState } from "react";
import { api } from "~/utils/api";
import ChatMessage from "./ChatMessage";
import { useSession } from "next-auth/react";
import { type Prompt, type Chat, type Message } from "@prisma/client";
import ChatInput from "./ChatInput/ChatInput";
import { type Atom, useAtom, atom } from "jotai";
import { getContentWithActivePrompts } from "./PromptModal";
import { storedChatIDAtom } from "~/atoms/atoms";
import Spinner from "./Spinner";
import { activePromptsAtom } from "~/atoms/atoms";

// interface ChatProps {
//   storedChatIDAtom: Atom<string>;
// }

export default function Chat() {
  const [activePrompts, setActivePrompts] = useAtom(activePromptsAtom);
  const [storedChatID, setStoredChatID] = useAtom(storedChatIDAtom);
  const [chatData, setChatData] = useState<Chat | undefined>(undefined);
  const { data: sessionData } = useSession();
  // Database calls
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
      window.scrollTo({
        top: document.documentElement.getBoundingClientRect().height,
        behavior: "smooth",
      });
    },
    onError: (err) => {
      setState("error");
      console.error(err);
    },
  });
  const createChat = api.chat.createChat.useMutation({
    onSuccess: (newChat) => {
      setChatData(newChat);
      console.log("New chat created! ", newChat);
    },
    onError: (err) => {
      setState("error");
      console.error(err);
    },
  });
  // Open AI calls
  const { mutateAsync: getAnswerAsync, isLoading: answerIsLoading } =
    api.openai.getAnswer.useMutation({});
  const getTitleFromMessage = api.openai.getChatTitle.useMutation();

  const [messages, setMessages] = useState<Message[]>(chatMessages ?? []);
  const [state, setState] = useState<"default" | "loading" | "error">(
    "default"
  );

  const sendMessage = async (text: string) => {
    if (!text) return;

    const messageWithPrompts = getContentWithActivePrompts(text, activePrompts);
    if (!chatData) {
      try {
        const chatTitleResponse = await getTitleFromMessage.mutateAsync({
          message: messageWithPrompts,
          aiModel: "ChatGPT",
        });
        const generatedTitle = chatTitleResponse?.title;

        if (generatedTitle) {
          const chat = await createChat.mutateAsync({
            title: generatedTitle,
            aiModel: "ChatGPT",
          });
          const message = await createMessage.mutateAsync({
            content: messageWithPrompts,
            chatId: chat.id,
            senderName: sessionData?.user.name ?? "",
          });
          const answer = await getAnswerAsync({
            message: messageWithPrompts,
            aiModel: "ChatGPT",
          });
          const memopupMessage = await createMessage.mutateAsync({
            content: answer?.answer ?? "",
            chatId: chat.id,
            senderName: "Memopup",
          });
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
      try {
        const message = await createMessage.mutateAsync({
          content: messageWithPrompts,
          chatId: chatData?.id,
          senderName: sessionData?.user.name ?? "",
        });
        const answer = await getAnswerAsync({
          message: messageWithPrompts,
          aiModel: "ChatGPT",
        });
        const memopupMessage = await createMessage.mutateAsync({
          content: answer?.answer ?? "",
          chatId: chatData?.id,
          senderName: "Memopup",
        });
      } catch (error) {
        console.error("Error:", error);
        return;
      }
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      setState("loading");
      void sendMessage(event.currentTarget.value);
      event.currentTarget.value = "";
    }
  };

  return (
    <>
      <div className="h-full w-full">
        <div className=" flex flex-col gap-2 px-4">
          {messages?.map((message, index) => {
            return (
              <ChatMessage
                key={index}
                showSenderName={true}
                showUpdatedAt={true}
                loading={false}
                {...message}
              />
            );
          })}
          {state === "loading" && (
            <div className="chat chat-end">
              <div className="chat-bubble flex items-center justify-center bg-base-200">
                <Spinner />
              </div>
            </div>
          )}
          {answerIsLoading && (
            <div className="chat chat-start">
              <div className="chat-bubble flex items-center justify-center bg-primary">
                <Spinner />
              </div>
            </div>
          )}
        </div>
      </div>
      <ChatInput onKeyDown={handleKeyDown} />
    </>
  );
}
