import { type Message } from "@prisma/client";
import cn from "classnames";
import { formatDistanceToNow, isSameSecond } from "date-fns";
import { type ComponentProps, useState } from "react";
import { useInterval } from "usehooks-ts";

export interface ChatMessageProps {
  showSenderName: boolean;
  showUpdatedAt: boolean;
  loading: boolean;
}

export default function ChatMessage(
  props: Message & ChatMessageProps & ComponentProps<"div">
) {
  const {
    content,
    createdAt,
    updatedAt,
    senderName,
    showSenderName,
    showUpdatedAt,
    loading: defaultLoading,
    ...containerProps
  } = props;
  const [loading, setLoading] = useState(defaultLoading);

  const getTimeSinceMessage = (): string => {
    if (isSameSecond(updatedAt, createdAt)) {
      return formatDistanceToNow(createdAt) + " ago";
    } else {
      return "edited " + formatDistanceToNow(updatedAt) + " ago";
    }
  };

  const [timeSinceMessage, setTimeSinceMessage] = useState(
    getTimeSinceMessage()
  );

  useInterval(
    () => {
      setTimeSinceMessage(getTimeSinceMessage());
    },
    showUpdatedAt ? 60 * 1000 : null
  );
  return (
    <div
      className={cn("chat gap-1 p-0 pt-1", {
        ["chat-start"]: senderName === "Memopup",
        ["chat-end"]: senderName !== "Memopup",
        ["animate-pulse"]: loading,
      })}
      {...containerProps}
    >
      {showSenderName && <div className="chat-header">{senderName}</div>}
      <div
        className={cn("chat-bubble bg-base-300", {
          ["bg-primary"]: senderName == "Memopup",
        })}
      >
        {content}
      </div>
      {showUpdatedAt && <div className="chat-footer">{timeSinceMessage}</div>}
    </div>
  );
}
