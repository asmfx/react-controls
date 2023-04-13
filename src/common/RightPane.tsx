import { ValidReturnTypes } from "./types";

export const RightPane: React.FC<{
  title?: string;
  description?: string;
  show: boolean;
  children: React.ReactNode;
  onHide?: () => ValidReturnTypes;
}> = ({ title, description, show, onHide, children }) => {
  return (
    <>
      <div
        className={
          show
            ? "asmfx-right-pane asmfx-right-pane-show"
            : "asmfx-right-pane asmfx-right-pane-hidden"
        }
      >
        <div className="asmfx-right-pane-bg" onClick={onHide}></div>
        <div className="asmfx-right-pane-content">
          {title && <h4>{title}</h4>}
          {description && <p>{description}</p>}
          {children}
        </div>
      </div>
    </>
  );
};
