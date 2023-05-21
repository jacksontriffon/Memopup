import { type ComponentProps } from "react";
import Button from "../Button";
import Input from "../Input";

// interface ChatInputProps {}

export default function ChatInput(props: ComponentProps<"input">) {
  const { ...inputProps } = props;

  return (
    <div className="sticky bottom-0 bg-gradient-to-b from-transparent to-base-100 px-4 pb-4 transition-all">
      <div className="flex flex-col gap-2 px-4 pb-4">
        <h3 className="text-lg font-bold text-neutral">Saved Prompts</h3>
        <div className="flex max-w-full flex-wrap gap-2">
          <Button modalId="prompt-modal">+ New Prompt?</Button>
        </div>
      </div>
      <Input {...inputProps} />
    </div>
  );
}
