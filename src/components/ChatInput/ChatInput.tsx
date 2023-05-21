import {
  useState,
  type ComponentProps,
  ChangeEventHandler,
  useEffect,
} from "react";
import Button from "../Button";
import Input from "../Input";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { type Prompt } from "@prisma/client";
import { useAtom } from "jotai";
import { activePromptsAtom } from "../Chat";
import { useEffectOnce } from "usehooks-ts";

// interface ChatInputProps {
//   // promptAtom: Atom<string>;
// }

export default function ChatInput(props: ComponentProps<"input">) {
  const { ...inputProps } = props;
  const [activePrompts, setActivePrompts] = useAtom(activePromptsAtom);
  const { data: sessionData, status: sessionStatus } = useSession();
  const { data: promptsData } = api.prompt.getAllPrompts.useQuery(undefined, {
    onSuccess: (currentPrompts) => setPrompts(currentPrompts),
  });
  const [prompts, setPrompts] = useState<Prompt[]>();

  useEffect(() => {
    setActivePrompts([]);
  }, []);

  return (
    <div className="sticky bottom-0 w-full bg-gradient-to-b from-transparent to-base-100 to-30% px-4 pb-4 pt-16 transition-all">
      <div className="flex flex-col gap-2 px-4 pb-4">
        <h3 className="text-lg font-bold text-neutral">Saved Prompts</h3>
        <div className="flex max-w-full flex-wrap gap-2">
          {prompts?.map((prompt, index) => (
            <Button
              key={index}
              togglable
              onClick={(e) => {
                if (e.currentTarget.ariaChecked) {
                  setActivePrompts([...activePrompts, prompt]);
                } else {
                  const withoutThisPrompt = activePrompts.filter(
                    (item) => item !== prompt
                  );
                  setActivePrompts(withoutThisPrompt);
                }
              }}
            >
              {prompt.title}
            </Button>
          ))}
          <Button modalId="prompt-modal">+ New Prompt?</Button>
        </div>
      </div>
      <Input autoFocus content="Checkers" {...inputProps} />
    </div>
  );
}
