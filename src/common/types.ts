import { DetailedHTMLProps, InputHTMLAttributes, ReactElement, ReactNode } from "react";
import { IControlValidationProps, IFormController } from "./useForm";
import { IDataController } from "./useDataController";

export type Variant =
  | "none"
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "light"
  | "dark"
  | "link"
  | "link-light";

export type BorderType = "square" | "rounded" | "circle";

export type ButtonType = "submit" | "button";

export type TextboxType = "text" | "password" | "number";

export type Layout = "form-control" | "raw";

export type Size = "lg" | "md" | "sm" | "xs";

export type ValidReturnTypes = Promise<void | boolean> | void | boolean;

export type UniqueValue = string | number;

export type HTMLInput = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export interface IBaseControlProps {
  label?: any;
  icon?: ReactNode;
  controller?: IFormController | IDataController;
  name?: string;
  variant?: Variant;
  border?: BorderType;
  layout?: Layout;
  size?: Size;
  bind?: any;
  tag?: any;
  disabled?: boolean;
  children?: ReactNode;
}

export interface IFormControlProps extends IBaseControlProps {
  placeholder?: string;
  value?: any;
  errors?: any;

  className?: string;
  suffix?: string | React.ReactNode;
  prefix?: string | React.ReactNode;
  children?: React.ReactNode;
  readOnly?: boolean;

  onChange?: (args: {
    value: string;
    name?: string;
    tag?: any;
  }) => ValidReturnTypes;
}

export interface ILabelProps extends Omit<IFormControlProps, "onChange"> { }
export interface IListViewerProps
  extends Omit<IFormControlProps, "onChange" | "value"> {
  value?: any[];
  options?: any[];
  renderItem?: (item: any, index?: number, list?: any[]) => ReactNode;
}

export interface ICrossFormProps
  extends Omit<IFormControlProps, "onChange" | "value"> {
  header?: any[];
  options?: any[];
  lookupRef?: string;
  value?: any[];
  renderItem?: (args: {
    selected: boolean;
    selectHandler: (options: any) => ValidReturnTypes;
    option: any;
    item: any;
    controller: IDataController;
    index?: number;
    list?: any[];
  }) => ReactNode;
  onChange?: (args: {
    value: any[];
    name?: string;
    tag?: any;
  }) => ValidReturnTypes;
}

export interface ITextboxProps
  extends IControlValidationProps,
  IFormControlProps {
  type?: TextboxType;
  maxLength?: number;
}

export interface ICheckboxProps
  extends IControlValidationProps,
  IFormControlProps { }

export interface IButtonProps extends IBaseControlProps {
  type?: ButtonType;
  data?: any;
  disabledLabel?: string;
  autoDisabled?: boolean;
  outline?: boolean;
  onClick?: (data?: any) => ValidReturnTypes;
}

export interface InputOption {
  id: UniqueValue;
  label?: string;
  name?: string;
  text?: string;
}

export interface ISelectProps
  extends IControlValidationProps,
  IFormControlProps {
  options?: InputOption[];
  parentKey?: string;
  rootId?: any;
  seperator?: string;
  visible?: boolean;
  noDefault?: boolean;
  onChange?: (args: {
    value: string;
    intValue?: number;
    name?: string;
    tag?: any;
  }) => ValidReturnTypes;
  dataType?: "int" | "string";
}

export interface IMultiSelectProps
  extends IControlValidationProps,
  IFormControlProps {
  options?: InputOption[];
  parentKey?: string;
  rootId?: any;
  seperator?: string;
  visible?: boolean;
  noDefault?: boolean;
  onChange?: (args: {
    value: any;
    name?: string;
    tag?: any;
  }) => ValidReturnTypes;
  dataType?: "int" | "string" | "csv";
}

export interface ICrossSelectProps
  extends IControlValidationProps,
  IFormControlProps {
  options?: InputOption[];
  parentKey?: string;
  rootId?: any;
  seperator?: string;
  visible?: boolean;
  noDefault?: boolean;
  lookupRef?: string;
  onChange?: (args: {
    value: any;
    name?: string;
    tag?: any;
  }) => ValidReturnTypes;
  dataType?: "int" | "string";
}

export interface ICardItemProps extends IBaseControlProps {
  title?: string;
  variant?: Variant;
  icon?: ReactNode;
  description?: string;
  actionLabel?: string;
  actionVariant?: Variant;
  cancelLabel?: string;
  cancelVariant?: Variant;
  type?: "modal" | "right-pane";
}
