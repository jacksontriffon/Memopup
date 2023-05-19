import { useState, type ComponentProps } from "react";
import cn from "classnames";
import { useSession, signOut } from "next-auth/react";
import { api } from "~/utils/api";
import { type Chat } from "@prisma/client";

// interface MenuProps {}

export default function Menu(props: ComponentProps<"div">) {
  const { data: sessionData } = useSession();

  const { data: allChatsData, refetch: refetchChats } =
    api.chat.getAllChats.useQuery(undefined, {
      enabled: sessionData?.user !== undefined,
      onSuccess: (currentChats) => {
        setChats(currentChats);
      },
    });

  const [chats, setChats] = useState<Chat[]>(allChatsData ?? []);
  const { children, className: classNameProp, ...containerProps } = props;

  return (
    <div {...containerProps} className={cn("drawer drawer-end", classNameProp)}>
      <input id="menu" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label htmlFor="menu" className="drawer-overlay"></label>
        <ul className="menu menu-vertical flex w-80 flex-col bg-base-100 p-4 text-base-content">
          <p className="menu-title">Chats</p>
          {chats?.map((chat, index) => (
            <li key={index}>
              <a>{chat.title}</a>
              <p>{chat.aiModel}</p>
            </li>
          ))}
          <li
            className="btn-outline btn-error btn mt-auto"
            onClick={() => sessionData && void signOut()}
          >
            Sign out
          </li>
        </ul>
      </div>
    </div>
  );
}
