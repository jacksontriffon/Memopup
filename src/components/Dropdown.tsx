import { type ComponentProps, useState } from "react";
import cn from "classnames";

export default function Dropdown(props: ComponentProps<"select">) {
  const { className: classNameProps, ...selectProps } = props;

  const [selected, setSelected] = useState("");
  return (
    <select
      className={cn("select-ghost select text-center text-lg", classNameProps)}
      {...selectProps}
    >
      <option className="text-sm" disabled defaultValue={""}>
        Pick AI model
      </option>
      <option value={"Midjourney"} className="text-sm">
        Midjourney
      </option>
      <option value="GPT-4" className="text-sm">
        GPT-4
      </option>
    </select>
  );
}
