import { Dropdown } from "primereact/dropdown";
import {
  getChildItems,
  getControlValidationErrors,
  getTreeOptions,
} from "./helpers";
import { ISelectProps } from "./types";

export const Select: React.FC<ISelectProps> = (props) => {
  const {
    controller,
    label,
    placeholder,
    className,
    tag,
    suffix,
    prefix,
    disabled,
    children,
    visible = true,
    options,
    parentKey,
    rootId,
    seperator,
    dataType = "int",
  } = props;

  let { name, errors, bind, value, onChange } = props;

  if (name && controller) {
    errors = controller.errors;
    if (!onChange) {
      onChange = ({ name, value }) => {
        if (name) {
          if (dataType === "int") {
            return controller.intChangeHandler({
              name,
              value,
            });
          } else {
            return controller.stringChangeHandler({
              name,
              value,
            });
          }
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

  const __options = options
    ? parentKey
      ? rootId
        ? getChildItems(options, parentKey, rootId, "", seperator || " / ")
        : getTreeOptions(options, parentKey, seperator || " / ")
      : options
    : [];
  const _options = __options?.map?.((i) => ({
    value: i.id.toString(),
    label: i.label || i.name || i.text,
  }));

  const changeHandler = (args: any) => {
    onChange && onChange({ name, value: args.value });

    if (onChange) {
      try {
        let intValue = parseInt(args.value);
        if (isNaN(intValue)) {
          throw new Error("Not a number!");
        }
        onChange({ value: args.value, intValue, name, tag });
      } catch {
        onChange({ value: args.value, name, tag });
      }
    }
  };

  const Control = (
    <div>
      <Dropdown
        value={_value ? _value.toString() : undefined}
        optionLabel={"label"}
        options={_options}
        filter={_options?.length > 20}
        showClear
        placeholder={placeholder}
        onChange={changeHandler}
        className={isInvalid}
      />
    </div>
  );

  if (!visible) {
    return <>!visible:{JSON.stringify(visible)}:</>;
  }

  if (!label) {
    return Control;
  }

  return (
    <div className={`${className ? className : "col mb-3"}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
        </label>
      )}
      <div className="input-group">
        {prefix && <span className="input-group-text">{prefix}</span>}
        {Control}
        {suffix && <span className="input-group-text">{suffix}</span>}
      </div>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
};
