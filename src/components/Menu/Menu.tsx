import { useState, type ComponentProps } from "react";
import cn from "classnames";
import { useSession, signOut } from "next-auth/react";
import { api } from "~/utils/api";
import { type Chat } from "@prisma/client";
import { useAtom } from "jotai";
import { storedChatIDAtom } from "~/atoms/atoms";
import Spinner from "../Spinner";

export default function Menu(props: ComponentProps<"div">) {
  const { children, className: classNameProp, ...containerProps } = props;
  const { data: sessionData } = useSession();
  const [storedChatID, setStoredChatID] = useAtom(storedChatIDAtom);

  const {
    data: allChatsData,
    refetch: refetchChats,
    isLoading,
  } = api.chat.getAllChats.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
    onSuccess: (currentChats) => {
      setChats(currentChats);
    },
  });
  const deleteChat = api.chat.deleteChat.useMutation({
    onSuccess: (deletedChat) => {
      setStoredChatID("");
      console.log("Successfully deleted chat | ", deletedChat);
    },
  });

  const [chats, setChats] = useState<Chat[]>(allChatsData ?? []);

  return (
    <div {...containerProps} className={cn("drawer drawer-end", classNameProp)}>
      <input
        id="menu"
        type="checkbox"
        className="drawer-toggle"
        onChange={(e) => {
          if (e.currentTarget.checked && !isLoading) {
            void refetchChats();
          }
        }}
      />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label htmlFor="menu" className="drawer-overlay"></label>
        <ul className="menu menu-vertical flex w-80 flex-col bg-base-100 p-4 text-base-content">
          <p className="menu-title">Chats</p>
          {isLoading && <Spinner />}
          {chats?.map((chat, index) => (
            <li key={index}>
              <a
                onClick={() => {
                  setStoredChatID(chat.id);
                  console.log(storedChatID);
                }}
              >
                {chat.title}
                <span className="badge badge-sm">{chat.aiModel}</span>
              </a>
            </li>
          ))}
          <li
            className="btn-outline btn-error btn mt-auto"
            onClick={() => sessionData && void signOut()}
          >
            Sign out
          </li>
          <li
            className="btn-outline btn-error btn mt-auto"
            onClick={() => {
              deleteChat.mutate({ chatId: storedChatID });
            }}
          >
            Delete this chat
          </li>
        </ul>
      </div>
    </div>
  );
}
