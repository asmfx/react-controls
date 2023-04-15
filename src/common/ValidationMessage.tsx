import React from "react";
import { Div } from "./Div";
import { getControlValidationErrors } from "./helpers";
import { Span } from "./Span";
import { IFormController } from "./useForm";

export const ValidationMessage: React.FC<{
  controller?: IFormController;
  errors?: any;
  as?: React.ElementType;
  target: string;
  option?: string;
  mode?: "VisibilityMode" | "DisplayMode" | "ProgressiveMode";
  children?: React.ReactNode;
  valid?: React.ReactNode;
  invalid?: React.ReactNode;
}> = ({
  as,
  controller,
  errors,
  target,
  option,
  mode,
  children,
  valid,
  invalid,
}) => {
  let Container = as || mode === "ProgressiveMode" ? Div : Span;
  mode = Container === Span ? mode || "DisplayMode" : mode;
  errors =
    mode === "ProgressiveMode"
      ? errors || controller?.checks
      : errors || controller?.errors;

  const _errors = getControlValidationErrors(errors, target);
  const error = option ? _errors.includes(option) : !!_errors.length;

  if (mode === "ProgressiveMode") {
    return (
      <Container className={error ? "text-secondary" : "text-primary"}>
        <i
          className={
            error
              ? "bx bx-error-circle text-danger me-1"
              : "bx bx-check-circle text-success me-1"
          }
        />
        {error ? invalid || children : valid || children}
      </Container>
    );
  } else if (mode === "DisplayMode") {
    return error ? (
      <Container className={"text-danger"}>
        <i className={"bx bx-error-circle me-1"} />
        {invalid || children}
      </Container>
    ) : (
      <></>
    );
  } else {
    return (
      <Container
        className={"text-danger" + (error ? " visible" : " invisible")}
      >
        <i className={"bx bx-error-circle me-1"} />
        {invalid || children}
      </Container>
    );
  }
};
