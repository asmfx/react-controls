import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "./Button";
import { Variant, ValidReturnTypes } from "./types";

export const ButtonWithConfirmation: React.FC<{
  title?: string;
  message?: string;
  label?: string;
  actionLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
  data?: any;
  disabled?: boolean;
  onAction?: (args?: any) => ValidReturnTypes;
  children?: React.ReactNode;
}> = ({
  title,
  message,
  actionLabel,
  cancelLabel,
  label,
  variant = "primary",
  onAction,
  disabled,
  children,
}) => {
  const [show, setShow] = useState(false);
  const actionHandler = async (values: any) => {
    if (onAction !== undefined && values !== undefined) {
      await onAction(values);
      setShow(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        disabled={disabled}
        label={label}
        onClick={() => setShow(true)}
      ></Button>
      <Modal show={show} onHide={() => setShow(false)}>
        {title && <Modal.Header>{title}</Modal.Header>}
        <Modal.Body>{children || message}</Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-end w-100 gap-2">
            {onAction && (
              <Button
                type="submit"
                label={label || actionLabel}
                variant={variant}
                onClick={actionHandler}
                autoDisabled
              />
            )}
            <Button
              variant="secondary"
              label={cancelLabel || "Return Back"}
              onClick={() => setShow(false)}
            />
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
