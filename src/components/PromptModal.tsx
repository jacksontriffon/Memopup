import Button from "./Button";
import Input from "./Input";
import Radio from "./Radio";

export default function PromptModal() {
  return (
    <>
      <input type="checkbox" id="prompt-modal" className="modal-toggle" />
      <div className="modal bg-base-100 bg-opacity-75">
        <div className="modal-box bg-base-200">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-neutral opacity-50">
              New Prompt
            </h3>
            <input
              className="input-secondary input w-full rounded-full border-none bg-base-100 text-lg font-bold"
              placeholder="Title"
            />
            <input
              className="input-secondary input w-full rounded-full border-none bg-base-100 text-lg font-bold"
              placeholder="Content  ( e.g.  Translate this to casual Japanese  ) "
            />
            <div className="mt-2 flex gap-x-8">
              <div className="w-[250px]">
                <h3 className="text-xl font-bold text-neutral opacity-75">
                  Add Prompt to?
                </h3>
                <Radio
                  text="Start"
                  radioName="where-to-add-prompt"
                  radioInputProps={{ className: "checked:bg-accent" }}
                />
                <Radio
                  text="End"
                  radioName="where-to-add-prompt"
                  radioInputProps={{ className: "checked:bg-accent" }}
                />
              </div>
              <section className="flex w-full flex-wrap gap-2">
                <h3 className="text-xl font-bold text-neutral opacity-75">
                  Include other prompts?
                </h3>
                <Button uncheckedClassNames="bg-base-100 btn-ghost" togglable>
                  Translate
                </Button>
                <Button uncheckedClassNames="bg-base-100 btn-ghost" togglable>
                  🎶 Poem
                </Button>
                <Button uncheckedClassNames="bg-base-100 btn-ghost" togglable>
                  Ethiopia
                </Button>
              </section>
            </div>
          </div>
          <div className="modal-action">
            <label
              htmlFor="prompt-modal"
              className="btn-ghost btn rounded-none text-base font-bold text-neutral"
            >
              Cancel
            </label>
            <Button modalId="prompt-modal" className="btn-primary">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
