import { useState } from "react";
import { IButtonProps } from "./types";

export const Button: React.FC<IButtonProps> = ({
  controller,
  bind,
  tag,
  type = "button",
  name,
  onClick,
  label,
  variant = "primary",
  disabled,
  border,
  size,
  outline,
  disabledLabel,
  autoDisabled,
}) => {
  const [innerDisabled, setInnerDisabled] = useState(false);

  if (controller) {
    bind = controller.values;
    if (!onClick && type === "submit") {
      disabled =
        disabled || (controller.errors.validate && !controller.errors.isValid);
      onClick = controller.submitHandler;
    }
  }

  let style = {};
  if (border === "circle") {
    const csize = "3em";
    style = {
      ...style,
      borderRadius: csize,
      width: csize,
      height: csize,
      display: "inline-block",
      padding: "0",
    };
  }
  const className = `btn btn-${outline ? "outline-" : ""}${variant}${
    size ? ` btn-${size}` : ``
  }`;

  const onClickHandler = async () => {
    if (onClick) {
      if (autoDisabled || autoDisabled === undefined) {
        setInnerDisabled(true);
        await onClick({ name, data: bind || tag });
        setInnerDisabled(false);
      } else {
        await onClick({ name, data: bind || tag });
      }
    }
  };

  return (
    <button
      type={type}
      style={style}
      className={className}
      disabled={innerDisabled || disabled}
      onClick={onClickHandler}
    >
      {innerDisabled || disabled ? disabledLabel ?? label : label}
    </button>
  );
};
