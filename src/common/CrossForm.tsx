import React from "react";
import { getControlValidationErrors } from "./helpers";
import { ICrossFormProps } from "./types";

export const CrossForm: React.FC<ICrossFormProps> = (props) => {
  const { controller, className, label, renderItem } = props;

  let { name, errors, bind, value } = props;

  if (name && controller) {
    errors = controller.errors;
  }

  const _errors = getControlValidationErrors(errors, name);
  const isInvalid = _errors.length ? " is-invalid" : "";

  const _value: any[] =
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
          {_value?.map?.(
            renderItem ? renderItem : (item: any) => <div>{item}</div>
          )}
        </div>
      </div>
    </>
  );
};
