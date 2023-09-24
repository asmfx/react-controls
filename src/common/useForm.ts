import { ValidReturnTypes } from "./types";
import { useEffect, useState } from "react";
import { getControlValidationErrors } from "./helpers";

export interface UseFormParameters<T> {
  initialValues?: Partial<T>;
  validate?: (values: Partial<T>) => any;
  onChange?: (values: Partial<T>, checks: any) => ValidReturnTypes;
  onSubmit?: (values: T) => any;
  onSuccess?: (result: any, values: T) => any;
  onFailed?: (error: any, values: T) => any;
}

export interface IAnyHandlerValue {
  name: string;
  value: any;
  autoSave?: boolean;
  partial?: boolean;
}

export interface IControlValidationProps {
  required?: boolean;
  regex?: boolean;
}

export interface IControlOptions
  extends IControlValidationProps,
  Record<string, any> { }

export interface IFormController extends UseFormReturnValues<any> { }

export interface UseFormReturnValues<T> {
  values: Partial<T>;
  errors: any;
  checks: any;
  busy: boolean;
  reset: () => ValidReturnTypes;
  setValues: (values: Partial<T>) => ValidReturnTypes;
  setObject: (values: Partial<T>) => ValidReturnTypes;
  setValue: (name: string, value?: any) => ValidReturnTypes;

  setErrors: (values: any, force?: boolean) => ValidReturnTypes;
  setError: (key: string, option?: any) => ValidReturnTypes;
  clearError: (key: string, option?: string) => ValidReturnTypes;

  submitHandler: () => ValidReturnTypes;

  changeHandler: (arg: IAnyHandlerValue) => ValidReturnTypes;
  rawChangeHandler: (arg: IAnyHandlerValue) => ValidReturnTypes;
  stringChangeHandler: (arg: IAnyHandlerValue) => ValidReturnTypes;
  intChangeHandler: (arg: IAnyHandlerValue) => ValidReturnTypes;
  booleanChangeHandler: (arg: IAnyHandlerValue) => ValidReturnTypes;

  keyStringChangeHandler: (
    key: keyof T
  ) => (arg: IAnyHandlerValue) => ValidReturnTypes;
  keyIntChangeHandler: (
    key: keyof T
  ) => (arg: IAnyHandlerValue) => ValidReturnTypes;
  keyBooleanChangeHandler: (
    key: keyof T
  ) => (arg: IAnyHandlerValue) => ValidReturnTypes;
  keyIntArrayChangeHandler: (
    key: keyof T
  ) => (arg: IAnyHandlerValue) => ValidReturnTypes;
  keyStringArrayChangeHandler: (
    key: keyof T
  ) => (arg: IAnyHandlerValue) => ValidReturnTypes;
}

export const simpleForm = ({
  values,
  onChange,
}: {
  values?: any;
  onChange: (args: IAnyHandlerValue) => ValidReturnTypes;
}) => {
  return {
    values,
    errors: {},
    checks: {},
    busy: false,
    reset: () => { },
    setValues: (values: any) => { },
    setObject: (values: any) => { },
    setValue: (name: string, value?: any) => { },

    setErrors: (values: any, force?: boolean) => { },
    setError: (key: string, option?: any) => { },
    clearError: (key: string, option?: string) => { },

    submitHandler: () => { },

    rawChangeHandler: onChange,
    changeHandler: onChange,
    stringChangeHandler: ({ value, ...args }: IAnyHandlerValue) => {
      onChange({ ...args, value: value?.toString() });
    },
    intChangeHandler: ({ value, ...args }: IAnyHandlerValue) => {
      onChange({ ...args, value: parseInt(value) });
    },
    booleanChangeHandler: ({ value, ...args }: IAnyHandlerValue) => {
      onChange({ ...args, value: !!value });
    },
    keyStringChangeHandler: (key: any) => (arg: IAnyHandlerValue) => { },
    keyIntChangeHandler: (key: any) => (arg: IAnyHandlerValue) => { },
    keyBooleanChangeHandler: (key: any) => (arg: IAnyHandlerValue) => { },
    keyIntArrayChangeHandler: (key: any) => (arg: IAnyHandlerValue) => { },
    keyStringArrayChangeHandler: (key: any) => (arg: IAnyHandlerValue) => { },
  };
};

export const useForm = <T extends object>(
  options?: UseFormParameters<T>
): UseFormReturnValues<T> => {
  const { initialValues, validate, onSubmit, onChange, onSuccess, onFailed } =
    options || {};
  const [busy, setBusy] = useState<boolean>(false);
  const [values, setValues] = useState<Partial<T>>(initialValues || {});
  const [errors, setErrors] = useState<any>({});
  const [checks, setChecks] = useState<any>({});

  const reset = () => {
    setValues({ ...initialValues });
    setChecks({});
    setErrors({});
  };

  useEffect(() => {
    reset();
  }, [initialValues]);

  const rawChangeHandler = ({ name, value, autoSave, partial }: IAnyHandlerValue) => {
    const newValues = { ...values, [name]: value };
    const isValid = validateAndSet(newValues);
    setValues(newValues);
    onChange?.(newValues, { isValid });
    if (autoSave) {
      const data = partial ? { [name]: value } : newValues;
      onSubmit?.(data as any);
    }
  };

  const keyStringChangeHandler =
    (key: keyof T, options?: { trim?: boolean }) =>
      ({ name, value }: IAnyHandlerValue) => {
        const newSubValues = { ...(values[key] || {}), [name]: value };
        const newValues = { ...values, [key]: newSubValues };
        const isValid = validateAndSet(newValues);
        setValues(newValues);
        onChange?.(newValues, { isValid });
      };

  const keyIntChangeHandler =
    (key: keyof T) =>
      ({ name, value }: IAnyHandlerValue) => {
        const newSubValues = { ...(values[key] || {}), [name]: parseInt(value) };
        const newValues = { ...values, [key]: newSubValues };
        const isValid = validateAndSet(newValues);
        setValues(newValues);
        onChange?.(newValues, { isValid });
      };

  const keyIntArrayChangeHandler =
    (key: keyof T) =>
      ({ name, value }: IAnyHandlerValue) => {
        const _arrValues = value
          .toString()
          .split(",")
          .filter((i: string) => i)
          .map((i: string) => parseInt(i))
          .filter((i: number) => i && !isNaN(i));
        const newSubValues = { ...(values[key] || {}), [name]: _arrValues };
        const newValues = { ...values, [key]: newSubValues };
        const isValid = validateAndSet(newValues);
        setValues(newValues);
        onChange?.(newValues, { isValid });
      };

  const keyBooleanChangeHandler =
    (key: keyof T) =>
      ({ name, value }: IAnyHandlerValue) => {
        const newSubValues = { ...(values[key] || {}), [name]: !!value };
        const newValues = { ...values, [key]: newSubValues };
        const isValid = validateAndSet(newValues);
        setValues(newValues);
        onChange?.(newValues, { isValid });
      };

  const keyStringArrayChangeHandler =
    (key: keyof T) =>
      ({ name, value }: IAnyHandlerValue) => {
        const _arrValues = value
          .toString()
          .split(",")
          .filter((i: string) => i);
        const newSubValues = { ...(values[key] || {}), [name]: _arrValues };
        const newValues = { ...values, [key]: newSubValues };
        const isValid = validateAndSet(newValues);
        setValues(newValues);
        onChange?.(newValues, { isValid });
      };

  const intChangeHandler = ({ name, value }: IAnyHandlerValue) => {
    const newValues = { ...values, [name]: parseInt(value) };
    const isValid = validateAndSet(newValues);
    setValues(newValues);
    onChange?.(newValues, { isValid });
  };

  const booleanChangeHandler = ({ name, value }: IAnyHandlerValue) => {
    const newValues = { ...values, [name]: !!value };
    const isValid = validateAndSet(newValues);
    setValues(newValues);
    onChange?.(newValues, { isValid });
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

  const setValue = (name: string, value: any) => {
    const newValues = { ...values, [name]: value };
    const isValid = validateAndSet(newValues);
    setValues(newValues);
    onChange?.(newValues, { isValid });
  };

  const setObject = (obj: any) => {
    const newValues = { ...values, ...obj };
    const isValid = validateAndSet(newValues);
    setValues(newValues);
    onChange?.(newValues, { isValid });
  };

  const validateAndSet = (values: any, force?: boolean) => {
    if (!validate) {
      return true;
    }
    const result = validate(values);
    return updateInternalErrors(result, force);
  };

  const submitHandler = async () => {
    if (!validateAndSet(values, true)) {
      return false;
    }
    if (onSubmit) {
      try {
        setBusy(true);
        const result = await onSubmit(values as T);
        console.log("result", result);

        if (
          result &&
          typeof result === "object" &&
          result.status !== undefined
        ) {
          if (result.status === 0) {
            onSuccess && (await onSuccess(result, values as T));
            reset();
            return true;
          } else {
            onFailed && (await onFailed(result, values as T));
            return false;
          }
        } else if (result !== false) {
          onSuccess && (await onSuccess(result, values as T));
          reset();
          return true;
        } else {
          onFailed && (await onFailed(result, values as T));
          return false;
        }
      } catch (err) {
        console.log("err", err);

        onFailed && (await onFailed(err, values as T));
        return false;
      }
    }
    return false;
  };

  const setError = (key: string, option?: any) => {
    if (option) {
      if (typeof option === "string") {
        if (!errors[key]?.[option]) {
          updateInternalErrors({
            ...errors,
            [key]: { ...(errors[key] || {}), [option]: true },
          });
        }
      } else {
        updateInternalErrors({ ...errors, [key]: option || true });
      }
    } else {
      updateInternalErrors({ ...errors, [key]: true });
    }
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

  useEffect(() => {
    validateAndSet(values);
  }, []);

  return {
    busy,
    values,
    errors,
    checks,
    reset,
    setValues,
    setObject,
    setValue,
    setErrors: updateInternalErrors,
    setError,
    clearError,
    changeHandler: rawChangeHandler,
    rawChangeHandler,
    stringChangeHandler: rawChangeHandler,
    keyStringChangeHandler,
    keyIntChangeHandler,
    keyBooleanChangeHandler,
    keyIntArrayChangeHandler,
    keyStringArrayChangeHandler,
    intChangeHandler,
    booleanChangeHandler,
    submitHandler,
  };
};
