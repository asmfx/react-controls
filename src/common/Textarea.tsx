import React from "react";
import { getControlValidationErrors } from "./helpers";
import { ITextareaProps } from "./types";

export const Textarea: React.FC<ITextareaProps> = (props) => {
  const {
    controller,
    label,
    placeholder,
    className,
    tag,
    suffix,
    prefix,
    maxLength,
    disabled,
    children,
    layout,
  } = props;

  let { name, errors, bind, value, onChange } = props;

  if (name && controller) {
    errors = controller.errors;
    if (!onChange) {
      onChange = ({ name, value }) => {
        if (name) {
          return controller.changeHandler({
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

  if (layout === "raw") {
    return (
      <textarea
        id={name}
        className={`form-control${isInvalid}`}
        placeholder={placeholder}
        onChange={changeHandler}
        maxLength={maxLength}
        disabled={disabled}
      >{_value}</textarea>
    );
  }

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
          <textarea
            id={name}
            className={`form-control${isInvalid}`}
            placeholder={placeholder}
            onChange={changeHandler}
            maxLength={maxLength}
            disabled={disabled}
          >{_value}</textarea>
          {suffix && <span className="input-group-text">{suffix}</span>}
        </div>
        {children && <div className="mt-2">{children}</div>}
      </div>
    </>
  );
};
