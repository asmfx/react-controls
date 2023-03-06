export const getControlValidationErrors = (
  errors: any,
  name?: string
): string[] => {
  const list: string[] = [];
  if (name && errors && errors[name]) {
    const controlErrors = errors[name];
    if (typeof controlErrors === "object") {
      list.push(
        ...Object.keys(controlErrors).filter((key) => !!controlErrors[key])
      );
    } else {
      return ["validation"];
    }
  }
  return list;
};

export const RegexValidation = {
  email: (value?: string) =>
    value && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value),
  containsUpper: (value?: string) => value && /[A-Z]+/.test(value),
  containsLower: (value?: string) => value && /[a-z]+/.test(value),
  containsNumeric: (value?: string) => value && /[0-9]+/.test(value),
};

export const statusFailCheck = (result: { status: number }) => {
  if (result.status !== 0) {
    return Promise.reject(result);
  }
  return Promise.resolve(result);
};
