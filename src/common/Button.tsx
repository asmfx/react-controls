import { useState } from "react";
import { IButtonProps, Size } from "./types";

export const Button: React.FC<IButtonProps> = ({
  controller,
  icon,
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
  children,
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
    const csizes: Record<Size, string> = {
      xs: "1.6em",
      sm: "2em",
      md: "3em",
      lg: "4em",
    };
    const csize = csizes[size || "md"];
    style = {
      ...style,
      borderRadius: csize,
      width: csize,
      height: csize,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
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
    <div style={style} className={className} onClick={onClickHandler}>
      {children || (
        <>
          {icon}
          {innerDisabled || disabled ? disabledLabel ?? label : label}
        </>
      )}
    </div>
  );
};
