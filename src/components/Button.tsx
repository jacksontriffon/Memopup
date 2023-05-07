import { useState, type ComponentProps } from "react";
import cn from "classnames";

interface ButtonProps {
  buttonType?: "toggle" | "button";
}

export default function Button(props: ComponentProps<"button"> & ButtonProps) {
  const {
    className: classNameProps,
    buttonType = "toggle",
    onClick: onClickCallback,
    ...buttonProps
  } = props;

  const [checked, setChecked] = useState(false);

  return buttonType === "toggle" ? (
    <>
      <input type="checkbox" className="hidden" checked={checked} />
      <button
        role="checkbox"
        type="button"
        className={cn(
          "btn rounded-none text-lg capitalize",
          {
            "btn-ghost bg-base-200": !checked,
            "btn-primary text-white": checked,
          },
          classNameProps
        )}
        aria-checked={checked}
        onClick={(e) => {
          setChecked(!checked);
          onClickCallback && onClickCallback(e);
        }}
        {...buttonProps}
      ></button>
    </>
  ) : buttonType === "button" ? (
    <button
      type="button"
      className={cn(
        "btn-outline btn rounded-none text-lg capitalize text-neutral",
        classNameProps
      )}
      {...buttonProps}
    ></button>
  ) : null;
}
