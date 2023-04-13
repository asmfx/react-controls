export const Div: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return <div {...props}>{children}</div>;
};
