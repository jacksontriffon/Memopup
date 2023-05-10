import Button from "./Button";
import Input from "./Input";

export default function Chat() {
  return (
    <div className="w-full p-4">
      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-lg font-bold text-neutral">Saved Prompts</h3>
        <div className="flex max-w-full flex-wrap gap-2">
          <Button togglable>Translate</Button>
          <Button togglable>🎶 Poem 🎶</Button>
          <Button modalId="prompt-modal">+ New Prompt?</Button>
        </div>
      </div>
      <Input />
    </div>
  );
}
