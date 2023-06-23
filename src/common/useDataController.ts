import { useState } from "react";
import { ValidReturnTypes } from "./types";
import { getControlValidationErrors } from "./helpers";

export interface IUseDataControllerArguments {
  initialValues?: any;
  validate?: any;
  onChange?: (values: any, checks: any) => ValidReturnTypes;
  onSubmit?: (values: any) => any;
  onSuccess?: (result: any, values: any) => any;
  onFailed?: (error: any, values: any) => any;
}

interface IDataControllerBase {
  busy: boolean;
  getValue: (selector?: string) => ValidReturnTypes;
  setValue: (selector: string | undefined, value: any) => ValidReturnTypes;
  mergeValue: (selector: string | undefined, value: any) => ValidReturnTypes;
  reset: () => ValidReturnTypes;
  clearError: (key: string, option?: string) => ValidReturnTypes;
  submit: () => ValidReturnTypes;
}

export interface IChangeHandlerArgs {
  name: string;
  selector?: string;
  value: any;
}

interface IListChangeHandlerArgs {
  ref: string;
  name: string;
  selector?: string;
  value: any;
}

export interface IDataController extends IDataControllerBase {
  values: any;
  errors: any;
  checks: any;
  changeHandler: (args: IChangeHandlerArgs) => ValidReturnTypes;
}

interface IDataListController extends IDataControllerBase {
  values: any[];
  errors: any[];
  checks: any[];
  changeHandler: (args: IListChangeHandlerArgs) => ValidReturnTypes;
  move: (ref: string, index: number) => ValidReturnTypes;
  moveUp: (ref: string) => ValidReturnTypes;
  moveDown: (ref: string) => ValidReturnTypes;
}

export const useDataController = (
  options: IUseDataControllerArguments
): IDataController => {
  const { initialValues, validate, onSubmit, onChange, onSuccess, onFailed } =
    options || {};

  const [busy, setBusy] = useState<boolean>(false);
  const [values, setValues] = useState<any>(initialValues || {});
  const [errors, setErrors] = useState<any>({});
  const [checks, setChecks] = useState<any>({});

  const reset = () => {
    setValues({ ...initialValues });
    setChecks({});
    setErrors({});
  };

  const updateInternalErrors = (newErrors: any, force?: boolean) => {
    const keys = Object.keys(newErrors).filter(
      (o) => !["isValid", "validate"].includes(o)
    );
    const findings = keys.flatMap((name) =>
      getControlValidationErrors(newErrors, name)
    );
    const isValid = findings.length === 0;
    setChecks({ ...newErrors, isValid });

    if (errors.validate || force) {
      setErrors({ ...newErrors, isValid, validate: true });
      return isValid;
    }
    return false;
  };

  const validateAndSet = (values: any, force?: boolean) => {
    if (!validate) {
      return true;
    }
    const result = validate(values);
    return updateInternalErrors(result, force);
  };

  const selectProperty = (selector: string) => {
    const arr = selector.split(/[.\[\]]/g).filter((i) => i);
    if (arr.length < 2) {
      return [values, selector];
    }
    const last = arr.splice(arr.length - 1, 1)[0];
    let reference = values;
    for (const key of arr) {
      if (key.includes(":")) {
        const [field, value] = key.split(":");
        reference = reference?.find?.((item: any) => item[field] == value);
      } else {
        const index = key ? parseInt(key) : NaN;
        reference = isNaN(index) ? reference?.[key] : reference?.[index];
      }
    }
    return [reference, last];
  };

  const copyUntilProperty = (selector: string) => {
    const arr = selector.split(/[.\[\]]/g).filter((i) => i);
    if (arr.length < 2) {
      const newValues = { ...values };
      return [newValues, newValues, selector];
    }
    const last = arr.splice(arr.length - 1, 1)[0];
    let newValues = { ...(values || {}) };
    let parent = newValues;
    let parentKey = "";
    let reference = parent;
    for (const key of arr) {
      if (key.includes(":")) {
        const [field, value] = key.split(":");
        parent[parentKey] = parent[parentKey]?.map?.((item: any) =>
          item[field] == value ? { ...item } : item
        );
        parent = reference;
        reference = parent[parentKey]?.find?.(
          (item: any) => item[field] == value
        );
      } else {
        const index = key ? parseInt(key) : NaN;
        if (isNaN(index)) {
          if (Array.isArray(reference[key])) {
            reference[key] = [...(reference[key] || {})];
          } else {
            reference[key] = { ...(reference[key] || {}) };
          }
          parent = reference;
          reference = reference[key];
        } else {
          if (Array.isArray(reference[index])) {
            reference[index] = [...(reference[index] || {})];
          } else {
            reference[index] = { ...(reference[index] || {}) };
          }
          parent = reference;
          reference = reference[index];
        }
      }
    }
    return [parent, reference, last];
  };

  const getValue = (selector?: string) => {
    if (!selector) return values;
    const [reference, key] = selectProperty(selector);
    return reference?.[key];
  };

  const setValue = (selector: string | undefined, value: any) => {
    if (!selector) {
      const newValues = { ...values, ...value };
      updateInternalValues(newValues);
      return;
    }
    const [newValues, reference, key] = copyUntilProperty(selector);
    reference[key] = { ...value };
    updateInternalValues(newValues);
  };

  const mergeValue = (selector: string | undefined, value: any) => {
    if (!selector) {
      const newValues = { ...values, ...value };
      updateInternalValues(newValues);
      return;
    }
    const [newValues, reference, key] = copyUntilProperty(selector);
    reference[key] = { ...(reference[key] || {}), ...value };
    updateInternalValues(newValues);
  };

  const updateInternalValues = (newValues: any) => {
    const isValid = validateAndSet(newValues);
    setValues(newValues);
    onChange?.(newValues, { isValid });
  };

  const changeHandler = ({ name, selector, value }: IChangeHandlerArgs) => {
    setValue(selector || name, value);
  };

  const submit = async () => {
    if (!validateAndSet(values, true)) {
      return false;
    }
    if (onSubmit) {
      try {
        setBusy(true);
        const result = await onSubmit(values);
        if (
          result &&
          typeof result === "object" &&
          result.status !== undefined
        ) {
          if (result.status === 0) {
            onSuccess && (await onSuccess(result, values));
            reset();
            return true;
          } else {
            onFailed && (await onFailed(result, values));
            return false;
          }
        } else if (result !== false) {
          onSuccess && (await onSuccess(result, values));
          reset();
          return true;
        } else {
          onFailed && (await onFailed(result, values));
          return false;
        }
      } catch (err) {
        onFailed && (await onFailed(err, values));
        return false;
      }
    }
    return false;
  };

  const clearError = (key: string, option?: string) => {
    if (option) {
      if (errors[key]?.[option]) {
        updateInternalErrors({
          ...errors,
          [key]: { ...errors[key], [option]: undefined },
        });
      }
    } else {
      updateInternalErrors({ ...errors, [key]: undefined });
    }
  };

  return {
    busy,
    values,
    errors,
    checks,
    reset,
    getValue,
    setValue,
    mergeValue,
    submit,
    changeHandler,
    clearError,
  };
};
