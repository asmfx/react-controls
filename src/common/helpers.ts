import { InputOption } from "./types";

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

export const getChildItems = (
  tree: any[],
  parentKey: string,
  id: any,
  label: string,
  seperator: string
) => {
  let options: InputOption[] = [];
  let childItems = tree.filter((o) => o[parentKey] === id);
  childItems.sort((a, b) =>
    (a.label || a.name || a.text) < (b.label || b.name || b.text) ? -1 : 1
  );
  for (const child of childItems) {
    const item = {
      id: child.id,
      label: `${label ? `${label}${seperator}` : ""}${
        child.label || child.name || child.text
      }`,
    };
    options.push(
      item,
      ...getChildItems(tree, parentKey, item.id, item.label, seperator)
    );
  }
  return options;
};
export const getTreeOptions = (
  tree: any[],
  parentKey: string,
  seperator: string
) => {
  let options: InputOption[] = [];
  let childItems = tree.filter((o) => !o[parentKey]);
  childItems.sort((a, b) =>
    (a.label || a.name || a.text) < (b.label || b.name || b.text) ? -1 : 1
  );
  for (const child of childItems) {
    const item = {
      id: child.id,
      label: child.label || child.name || child.text,
    };
    options.push(
      item,
      ...getChildItems(tree, parentKey, item.id, item.label, seperator)
    );
  }
  return options;
};

export const getValue = (obj: any, path: string) => {
  const _getValue = (obj: any, path: string[]): any => {
    const key = path.shift();
    if (!obj || !key) {
      return obj;
    }
    return _getValue(obj[key], path);
  };
  return _getValue(obj, path.split("."));
};
