import { type ComponentProps, useState } from "react";
import cn from "classnames";

export default function Dropdown(props: ComponentProps<"select">) {
  const { className: classNameProps, ...selectProps } = props;

  const [selected, setSelected] = useState("");
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
      <option value="Midjourney" className="@xs:text-md cursor-pointer">
        Midjourney
      </option>
      <option value="GPT-4" className="@xs:text-md cursor-pointer">
        GPT-4
      </option>
    </select>
  );
}
