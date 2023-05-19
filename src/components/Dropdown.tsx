import { type ComponentProps } from "react";
import cn from "classnames";

export default function Dropdown(props: ComponentProps<"select">) {
  const { className: classNameProps, ...selectProps } = props;

  return (
    <select
      onSelect={(e) => console.log(e)}
      className={cn(
        "select-ghost select border-none text-center text-lg @xs:text-xl",
        classNameProps
      )}
      {...selectProps}
    >
      {/* <button
        className="@xs:text-md cursor-not-allowed text-sm"
        disabled
        defaultValue={""}
      >
        Pick AI model
      </button> */}
      <option
        disabled
        value="Midjourney"
        className="@xs:text-md cursor-pointer text-center"
      >
        Midjourney
      </option>
      <option
        value="ChatGPT"
        className="@xs:text-md cursor-pointer text-center"
      >
        ChatGPT
      </option>
    </select>
  );
}
