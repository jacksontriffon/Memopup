import { useState, type ComponentProps, useEffect, useRef } from "react";
import Button from "../Button";
import Input from "../Input";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { type Prompt } from "@prisma/client";
import { useAtom } from "jotai";
import { activePromptsAtom, editPromptAtom } from "~/atoms/atoms";
import { useEffectOnce, useInterval } from "usehooks-ts";

// interface ChatInputProps {
//   // promptAtom: Atom<string>;
// }

export default function ChatInput(props: ComponentProps<"input">) {
  const { ...inputProps } = props;
  const [activePrompts, setActivePrompts] = useAtom(activePromptsAtom);
  const _session = useSession();
  const { data: promptsData } = api.prompt.getAllPrompts.useQuery(undefined, {
    onSuccess: (currentPrompts) => setPrompts(currentPrompts),
  });
  const [prompts, setPrompts] = useState<Prompt[]>();
  const [holdingPrompt, setHoldingPrompt] = useState<Prompt>();

  useEffectOnce(() => {
    setActivePrompts([]);
  });
  const [editPrompt, setEditPrompt] = useAtom(editPromptAtom);
  useInterval(
    () => {
      setEditPrompt(holdingPrompt);
      editPromptModalRef.current?.click();
      setHoldingPrompt(undefined);
    },
    holdingPrompt ? 1000 : null
  );

  const editPromptModalRef = useRef<HTMLLabelElement>(null);

  return (
    <div className="sticky bottom-0 w-full bg-gradient-to-b from-transparent to-base-100 to-30% px-4 pb-4 pt-16 transition-all">
      <div className="flex flex-col gap-2 px-4 pb-4">
        <h3 className="text-lg font-bold text-neutral">Saved Prompts</h3>
        <div className="flex max-w-full flex-wrap gap-2">
          {prompts?.map((prompt, index) => (
            <Button
              key={index}
              togglable
              onClick={() => {
                if (!activePrompts.includes(prompt)) {
                  setActivePrompts([...activePrompts, prompt]);
                } else {
                  const withoutThisPrompt = activePrompts.filter(
                    (item) => item !== prompt
                  );
                  setActivePrompts(withoutThisPrompt);
                }
              }}
              onMouseDown={() => setHoldingPrompt(prompt)}
              onTouchStart={() => setHoldingPrompt(prompt)}
              onMouseLeave={() => {
                if (holdingPrompt) {
                  setHoldingPrompt(undefined);
                }
              }}
              onTouchCancel={() => {
                if (holdingPrompt) {
                  setHoldingPrompt(undefined);
                }
              }}
              onMouseUp={() => {
                if (holdingPrompt) {
                  setHoldingPrompt(undefined);
                }
              }}
            >
              {prompt.title}
            </Button>
          ))}
          <Button modalId="prompt-modal">+ New Prompt?</Button>
          <label
            ref={editPromptModalRef}
            className="invisible"
            htmlFor="edit-prompt-modal"
          ></label>
        </div>
      </div>
      <Input autoFocus content="Checkers" {...inputProps} />
    </div>
  );
}
