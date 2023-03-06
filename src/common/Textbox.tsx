import React, { useEffect } from "react";
import { getControlValidationErrors } from "./helpers";
import { ITextboxProps } from "./types";

export const Textbox: React.FC<ITextboxProps> = (props) => {
  const {
    controller,
    label,
    type = "text",
    placeholder,
    className,
    tag,
    suffix,
    prefix,
    maxLength,
    disabled,
    children,
  } = props;

  let { name, errors, bind, value, onChange } = props;

  if (name && controller) {
    errors = controller.errors;
    if (!onChange) {
      onChange = ({ name, value }) => {
        if (name) {
          return controller.stringChangeHandler({
            name,
            value,
          });
        }
      };
    }
  }

  const _errors = getControlValidationErrors(errors, name);
  const isInvalid = _errors.length ? " is-invalid" : "";

  const _value: string =
    controller?.values && name
      ? controller.values[name]
      : bind && name && typeof bind === "object"
      ? bind[name] || value
      : value;

  const changeHandler = (event: any) => {
    onChange && onChange({ name, tag, value: event.target.value });
  };

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
          <input
            id={name}
            className={`form-control${isInvalid}`}
            type={type}
            placeholder={placeholder}
            onChange={changeHandler}
            value={_value}
            maxLength={maxLength}
            disabled={disabled}
          />
          {suffix && <span className="input-group-text">{suffix}</span>}
        </div>
        {children && <div className="mt-2">{children}</div>}
      </div>
    </>
  );
};
