import { type Prompt } from "@prisma/client";
import Button from "./Button";
import Radio from "./Radio";
import { type FormEventHandler, useState } from "react";
import { api } from "~/utils/api";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { editPromptAtom } from "~/atoms/atoms";

const promptInProgressAtom = atomWithStorage<
  Omit<Prompt, "id" | "createdAt" | "updatedAt" | "userId">
>("promptInProgress", {
  aiModel: "ChatGPT",
  content: "",
  prefix: true,
  title: "",
});

export const getContentWithActivePrompts = (
  content: string,
  activePrompts: Prompt[]
): string => {
  let contentWithPrompts = content;
  activePrompts.forEach((prompt) => {
    if (prompt.prefix) {
      contentWithPrompts = prompt.content + contentWithPrompts;
    } else {
      contentWithPrompts = contentWithPrompts + prompt.content;
    }
  });
  return contentWithPrompts;
};

export default function EditPromptModal() {
  const { data: promptData, refetch: refetchPrompts } =
    api.prompt.getAllPrompts.useQuery(undefined, {
      onSuccess: (currentPrompts) => setPrompts(currentPrompts),
    });
  const updatePrompt = api.prompt.updatePrompt.useMutation({
    onSuccess: (_newPrompt) => refetchPrompts(),
  });
  const deletePrompt = api.prompt.deletePrompt.useMutation({
    onSuccess: (deletedPrompt) => {
      console.log(deletedPrompt, " | Deleted");
    },
  });
  const [editPrompt, setEditPrompt] = useAtom(editPromptAtom);

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    if (
      editPrompt?.aiModel &&
      editPrompt.title &&
      editPrompt.content &&
      editPrompt.prefix
    ) {
      try {
        void updatePrompt.mutateAsync({
          ...editPrompt,
        });
        setEditPrompt({ ...editPrompt, title: "", content: "" });
      } catch (error) {
        setErrorMessage("Sorry an error occurred, please try again");
        console.error(error);
      }
    } else {
      setErrorMessage("You need to fill all the fields before submitting");
    }
  };
  const [prompts, setPrompts] = useState<Prompt[] | undefined>();
  const [errorMessage, setErrorMessage] = useState("");
  const [activePrompts, setActivePrompts] = useState<Prompt[]>([]);

  return (
    <form id="edit-prompt-form" onSubmit={handleSubmit}>
      <input
        readOnly
        type="checkbox"
        id="edit-prompt-modal"
        className="modal-toggle"
        onChange={() => {
          return;
        }}
      />
      <label
        className="modal bg-base-100 bg-opacity-75"
        htmlFor="edit-prompt-modal"
      >
        <label className="modal-box relative bg-base-200" htmlFor="">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-neutral opacity-50">
              Edit Prompt
            </h3>
            <input
              defaultValue={editPrompt?.title}
              onChange={(e) => {
                if (editPrompt) {
                  setEditPrompt({
                    ...editPrompt,
                    title: e.currentTarget.value,
                  });
                }
                setErrorMessage("");
              }}
              className="input-secondary input w-full rounded-full border-none bg-base-100 text-lg font-bold"
              placeholder="Title"
            />
            <input
              defaultValue={editPrompt?.content}
              onChange={(e) => {
                if (editPrompt) {
                  setEditPrompt({
                    ...editPrompt,
                    content: e.currentTarget.value,
                  });
                }
                setErrorMessage("");
              }}
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
                  defaultChecked={editPrompt?.prefix}
                  radioInputProps={{
                    className: "checked:bg-accent",
                    onChange: (e) => {
                      if (editPrompt) {
                        setEditPrompt({
                          ...editPrompt,
                          prefix: e.currentTarget.checked,
                        });
                      }
                    },
                  }}
                />
                <Radio
                  text="End"
                  radioName="where-to-add-prompt"
                  defaultChecked={!editPrompt?.prefix}
                  radioInputProps={{
                    className: "checked:bg-accent",
                    onChange: (e) => {
                      if (editPrompt) {
                        setEditPrompt({
                          ...editPrompt,
                          prefix: !e.currentTarget.checked,
                        });
                      }
                    },
                  }}
                />
              </div>
              <section className="flex w-full flex-wrap gap-2">
                {prompts && prompts.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold text-neutral opacity-75">
                      Include other prompts?
                    </h3>
                    {prompts?.map((prompt, index) => (
                      <Button
                        key={index}
                        uncheckedClassNames="bg-base-100 btn-ghost"
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
                      >
                        {prompt.title}
                      </Button>
                    ))}
                  </>
                )}
              </section>
            </div>
          </div>
          {errorMessage && <p className="pt-4 text-error">{errorMessage}</p>}
          <div className="modal-action">
            <Button
              className="btn-error btn-ghost mr-auto"
              onClick={() => {
                console.log("Deleting...");
                void deletePrompt.mutateAsync({ id: editPrompt?.id ?? "" });
              }}
            >
              Delete
            </Button>
            <label
              htmlFor="edit-prompt-modal"
              className="btn-ghost btn rounded-none text-base font-bold text-neutral"
            >
              Cancel
            </label>
            <Button
              type="submit"
              form="prompt-form"
              value="Submit"
              className="btn-primary"
            >
              Save Changes
            </Button>
          </div>
        </label>
      </label>
    </form>
  );
}
