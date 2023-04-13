import { getControlValidationErrors } from "./helpers";
import { ICheckboxProps } from "./types";

export const Checkbox: React.FC<ICheckboxProps> = (props) => {
  const {
    controller,
    label,
    placeholder,
    className,
    tag,
    suffix,
    prefix,
    readOnly,
    disabled,
    children,
  } = props;

  let { name, errors, bind, value, onChange } = props;

  if (name && controller) {
    errors = controller.errors;
    if (!onChange) {
      onChange = ({ name, value }) => {
        if (name) {
          return controller.booleanChangeHandler({
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
      <div className={className ? `form-check ${className}` : "form-check"}>
        <input
          className={`form-check-input${isInvalid}`}
          type="checkbox"
          id={name}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={changeHandler}
          checked={!!_value}
          disabled={disabled}
        />
        <label className="form-check-label" htmlFor={name}>
          {label}
        </label>
      </div>
    </>
  );
};
