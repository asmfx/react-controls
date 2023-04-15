import React from "react";
import {
  getChildItems,
  getControlValidationErrors,
  getTreeOptions,
} from "./helpers";
import { ICrossSelectProps, InputOption } from "./types";
import { MultiSelect as PRMultiSelect } from "primereact/multiselect";

export const CrossSelect: React.FC<ICrossSelectProps> = (props) => {
  const {
    controller,
    label,
    placeholder,
    className,
    tag,
    suffix,
    prefix,
    disabled,
    lookupRef,
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
          return controller.rawChangeHandler({
            name,
            value,
          });
        }
      };
    }
  }

  const _errors = getControlValidationErrors(errors, name);
  const _className = _errors.length ? "col is-invalid" : "col";

  const __rvalue: any =
    controller?.values && name
      ? controller.values[name]
      : bind && name && typeof bind === "object"
      ? bind[name] || value
      : value;

  let __value: any[] = !__rvalue
    ? []
    : typeof __rvalue === "string"
    ? __rvalue?.split?.(",")?.filter?.((i) => i) || []
    : Array.isArray(__rvalue)
    ? __rvalue
    : [__rvalue];

  const _value = __value
    .map((i) => (typeof i === "object" ? i[lookupRef || "id"] : i))
    .filter(Boolean)
    .map((i) => i.toString());

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
    const __argv: any[] = args.value?.filter?.(
      (item: any, index: number, list: any[]) =>
        item !== undefined && list.indexOf(item) === index
    );
    const _value: any =
      dataType === "int"
        ? __argv.map((item) =>
            typeof item === "string" ? parseInt(item) : item
          )
        : __argv.map((i) => i.toString());
    const value = _value.map((i: any) => ({ [lookupRef || "id"]: i }));

    onChange && onChange({ name, value });
  };

  const Control = (
    <div>
      <PRMultiSelect
        className={_className}
        placeholder="Select Options..."
        optionValue="value"
        optionLabel={"label"}
        options={_options}
        value={_value}
        onChange={changeHandler}
        filter={_options?.length > 20}
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
