import cn from "classnames";
import { type ComponentProps } from "react";

interface RadioProps {
  text: string;
  radioName: string;
  radioInputProps: Omit<ComponentProps<"input">, "type" | "checked" | "name">;
}

export default function Radio(props: ComponentProps<"div"> & RadioProps) {
  const {
    text,
    radioName,
    radioInputProps,
    className: containerClassName,
    ...containerProps
  } = props;
  const { className: radioClassName, ...radioProps } = radioInputProps;
  return (
    <div className={cn("form-control", containerClassName)} {...containerProps}>
      <label className="label cursor-pointer">
        <span className="label-text text-xl font-bold">{text}</span>
        <input
          type="radio"
          name={radioName}
          className={cn("radio", radioClassName)}
          checked
          readOnly
          {...radioProps}
        />
      </label>
    </div>
  );
}
