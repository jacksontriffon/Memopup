import { type Message } from "@prisma/client";
import cn from "classnames";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useInterval } from "usehooks-ts";

export interface ChatMessageProps {
  showSenderName: boolean;
  showUpdatedAt: boolean;
}

export default function ChatMessage(props: Message & ChatMessageProps) {
  const {
    content,
    createdAt,
    updatedAt,
    senderName,
    showSenderName,
    showUpdatedAt,
  } = props;

  const [timeSinceMessage, setTimeSinceMessage] = useState(
    formatDistanceToNow(createdAt)
  );

  const getTimeSinceMessage = (): string => {
    if (updatedAt !== createdAt) {
      return "edited " + formatDistanceToNow(updatedAt) + " ago";
    } else {
      return formatDistanceToNow(createdAt) + " ago";
    }
  };

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
      })}
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
