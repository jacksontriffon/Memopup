import { type Prompt } from "@prisma/client";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const storedChatIDAtom = atomWithStorage<string>("chatId", "");
export const activePromptsAtom = atom<Prompt[]>([]);
export const editPromptAtom = atom<Prompt | undefined>(undefined);
