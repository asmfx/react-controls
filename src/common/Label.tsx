import React from "react";
import { getControlValidationErrors } from "./helpers";
import { ILabelProps } from "./types";

export const Label: React.FC<ILabelProps> = (props) => {
  const {
    controller,
    label,
    placeholder,
    className,
    suffix,
    prefix,
    children,
  } = props;

  let { name, errors, bind, value } = props;

  if (name && controller) {
    errors = controller.errors;
  }

  const _errors = getControlValidationErrors(errors, name);
  const isInvalid = _errors.length ? " is-invalid" : "";

  const _value: string =
    controller?.values && name
      ? controller.values[name]
      : bind && name && typeof bind === "object"
      ? bind[name] || value
      : value;

  return (
    <>
      <div className={`${className ? className : "col mb-3"}`}>
        {label && (
          <label htmlFor={name} className="form-label">
            {label}
          </label>
        )}
        <div className="input-group">
          {prefix && <span className="input-group-text">{prefix}</span>}
          <span
            id={name}
            className={`text-small ${isInvalid}`}
            placeholder={placeholder}
          >
            {_value}
          </span>
          {suffix && <span className="input-group-text">{suffix}</span>}
        </div>
        {children && <div className="mt-2">{children}</div>}
      </div>
    </>
  );
};
