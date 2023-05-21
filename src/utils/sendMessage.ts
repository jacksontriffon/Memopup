import { type Chat } from "@prisma/client";
import { api } from "./api";

export const sendMessage = async (chatData: Chat | undefined, text: string) => {
  const getAnswer = api.openai.getAnswer.useMutation({});
  const getTitleFromMessage = api.openai.getChatTitle.useMutation();

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
