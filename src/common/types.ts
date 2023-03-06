import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { IControlValidationProps, IFormController } from "./useForm";

export type Variant =
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

export type Layout = "control-with-label" | "control";

export type Size = "lg" | "md" | "sm" | "xs";

export type ValidReturnTypes = Promise<void | boolean> | void | boolean;

export type UniqueValue = string | number;

export type HTMLInput = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export interface IBaseControlProps {
  label?: string;
  controller?: IFormController;
  name?: string;
  variant?: Variant;
  border?: BorderType;
  size?: Size;
  bind?: any;
  tag?: any;
  disabled?: boolean;
}

export interface IFormControlProps extends IBaseControlProps {
  placeholder?: string;
  value?: any;
  errors?: any;

  className?: string;
  suffix?: string | React.ReactNode;
  prefix?: string | React.ReactNode;
  children?: React.ReactNode;

  onChange?: (args: {
    value: string;
    name?: string;
    tag?: any;
  }) => ValidReturnTypes;
}

export interface ILabelProps extends Omit<IFormControlProps, "onChange"> {}

export interface ITextboxProps
  extends IControlValidationProps,
    IFormControlProps {
  type?: TextboxType;
  maxLength?: number;
}

export interface IButtonProps extends IBaseControlProps {
  type?: ButtonType;
  disabledLabel?: string;
  autoDisabled?: boolean;
  outline?: boolean;
  onClick?: (args?: { name?: string; data?: any }) => ValidReturnTypes;
}

export interface InputOption {
  id: UniqueValue;
  label?: string;
  name?: string;
  text?: string;
}
