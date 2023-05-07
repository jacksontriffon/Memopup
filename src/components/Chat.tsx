import Button from "./Button";

export default function Chat() {
  return (
    <div className="w-full p-4">
      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-lg font-bold text-neutral">Saved Prompts</h3>
        <div className="flex max-w-full flex-wrap gap-2">
          <Button>Translate</Button>
          <Button>🎶 Poem 🎶</Button>
          <Button buttonType="button">+ New Prompt?</Button>
        </div>
      </div>
      <input
        className="input-secondary input w-full rounded-full border-none bg-base-200 text-lg font-bold"
        placeholder="Type a prompt"
      />
    </div>
  );
}
