import React, { useState } from "react";
import { ICardItemProps } from "./types";
import { Modal } from "react-bootstrap";
import { Button } from "./Button";
import { RightPane } from "./RightPane";
import { Div } from "./Div";

export const CardItem: React.FC<ICardItemProps> = (props) => {
  const {
    title,
    description,
    icon,
    variant = "warning",
    type = "modal",
    actionLabel = "Save",
    actionVariant = "primary",
    cancelLabel = "Cancel",
    cancelVariant = "secondary",
    children,
    controller,
  } = props;
  const [show, setShow] = useState(false);
  const ViewController = type === "modal" ? Modal : RightPane;
  const ViewHeader = type === "modal" ? Modal.Header : Div;
  const ViewBody = type === "modal" ? Modal.Body : Div;
  const ViewFooter = type === "modal" ? Modal.Footer : Div;
  const cancelHandler = () => {
    setShow(false);
  };
  const showHandler = () => {
    setShow(true);
  };
  const actionHandler = () => {
    if (controller && "submitHandler" in controller) {
      controller.submitHandler();
    }
    setShow(false);
  };
  return (
    <>
      <Button variant={variant} size="sm" border="circle" onClick={showHandler}>
        {icon}
      </Button>
      <ViewController show={show} onHide={cancelHandler}>
        {title && (
          <ViewHeader>
            <h4>{title}</h4>
          </ViewHeader>
        )}
        <ViewBody>
          {description && <p>{description}</p>}
          {children}
        </ViewBody>
        <ViewFooter>
          <div className="d-flex gap-2">
            <Button
              label={actionLabel}
              variant={actionVariant}
              onClick={actionHandler}
            />
            <Button
              label={cancelLabel}
              variant={cancelVariant}
              onClick={cancelHandler}
            />
          </div>
        </ViewFooter>
      </ViewController>
    </>
  );
};
