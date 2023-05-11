import { useState, type ComponentProps } from "react";
import cn from "classnames";

interface ButtonProps {
  togglable?: boolean;
  modalId?: string;
  checkboxProps?: ComponentProps<"input">;
  checkedClassNames?: string;
  uncheckedClassNames?: string;
}

export default function Button(props: ComponentProps<"button"> & ButtonProps) {
  const {
    className: classNameProps,
    togglable = false,
    modalId,
    checkedClassNames = "btn-primary text-white",
    uncheckedClassNames = "btn-ghost bg-base-200",
    onClick: onClickCallback,
    checkboxProps,
    ...buttonProps
  } = props;

  const [checked, setChecked] = useState(false);

  return togglable ? (
    <>
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        readOnly
        {...checkboxProps}
      />
      <button
        role="checkbox"
        type="button"
        className={cn("btn rounded-none text-lg capitalize", classNameProps, {
          [uncheckedClassNames]: !checked,
          [checkedClassNames]: checked,
        })}
        aria-checked={checked}
        onClick={(e) => {
          setChecked(!checked);
          onClickCallback && onClickCallback(e);
        }}
        {...buttonProps}
      ></button>
    </>
  ) : modalId ? (
    <label
      htmlFor={modalId}
      className={cn(
        "btn-outline btn rounded-none text-lg capitalize text-neutral",
        classNameProps
      )}
    >
      {props.children}
    </label>
  ) : (
    <button
      type="button"
      className={cn(
        "btn-outline btn rounded-none text-lg capitalize text-neutral",
        classNameProps
      )}
      {...buttonProps}
    ></button>
  );
}
