import Button from "./Button";

export default function PromptModal() {
  return (
    <>
      <input type="checkbox" id="prompt-modal" className="modal-toggle" />
      <div className="modal bg-base-100 bg-opacity-75">
        <div className="modal-box bg-base-200">
          <h3 className="text-lg font-bold">
            Congratulations random Internet user!
          </h3>
          <p className="py-4">{"Hello"}</p>
          <div className="modal-action">
            <Button modalId="prompt-modal" className="btn-primary btn-active">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
