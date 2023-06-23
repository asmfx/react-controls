import React from "react";
import { getControlValidationErrors } from "./helpers";
import { ICrossFormProps } from "./types";
import { IAnyHandlerValue, IFormController, simpleForm } from "./useForm";

export const CrossForm: React.FC<ICrossFormProps> = (props) => {
  const [rows, setRows] = React.useState<any[]>([]);
  const {
    header,
    options,
    controller,
    className,
    label,
    renderItem,
    lookupRef,
    onChange,
    tag,
  } = props;

  let { name, errors, bind, value } = props;

  if (name && controller) {
    errors = controller.errors;
  }

  const _value: any[] =
    controller?.values && name
      ? controller.values[name]
      : bind && name && typeof bind === "object"
      ? bind[name] || value
      : value;

  const _options =
    options?.map?.((i) => ({
      ...i,
      value: i.id.toString(),
      label: i.label || i.name || i.text,
    })) || [];

  const changeHandler = (newRows: any[]) => {
    const _newValues = newRows
      .filter((i) => i.selected)
      .map((i) => ({
        [lookupRef || "referenceId"]: parseInt(i.option.value),
        ...i.item,
      }));
    if (controller && name) {
      controller.rawChangeHandler({ name, value: _newValues });
    }
    onChange?.({ name, value: _newValues, tag });
  };

  const getController = (row: any): IFormController =>
    simpleForm({
      values: row.item,
      onChange: ({ name, value }: IAnyHandlerValue) => {
        const _newRows = rows.map((i) =>
          i.option.value == row.option.value
            ? { ...i, item: { ...(row.item || {}), [name]: value } }
            : i
        );
        setRows(_newRows);
        changeHandler(_newRows);
      },
    });

  const selectHandler = (options: any) => {
    const _newRows = rows.map((i) =>
      i.option.value == options.tag ? { ...i, selected: !i.selected } : i
    );
    setRows(_newRows);
    changeHandler(_newRows);
  };

  const loadRows = () => {
    const _rows: any[] = [];
    let index = 0;

    for (const option of _options) {
      const item = _value.find(
        (i) => i[lookupRef || "referenceId"] == option.value
      );
      const selected = !!item;

      _rows.push({
        selected,
        item,
        option,
        index: index,
      });
      index++;
    }
    setRows(_rows);
  };

  React.useEffect(() => {
    loadRows();
  }, [options, value]);

  const _errors = getControlValidationErrors(errors, name);
  const isInvalid = _errors.length ? " is-invalid" : "";

  return (
    <>
      <div className={`${className ? className : "col mb-3"}`}>
        {label && (
          <label htmlFor={name} className="form-label">
            {label}
          </label>
        )}
        <div className="input-group">
          <table className="table table-sm table-striped table-hover">
            {header && (
              <thead>
                <tr>
                  {header.map((item, index) => (
                    <td key={index}>{item}</td>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map?.((item) =>
                renderItem?.({
                  ...item,
                  controller: getController(item),
                  selectHandler,
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
