import cn from "classnames";
import { type ComponentProps } from "react";

export default function Input(props: ComponentProps<"input">) {
  const { className: classNameProps, ...inputProps } = props;
  return (
    <input
      className={cn(
        "input-secondary input w-full rounded-full border-none bg-base-200 text-lg font-bold",
        classNameProps
      )}
      placeholder="Type a prompt"
      {...inputProps}
    />
  );
}
