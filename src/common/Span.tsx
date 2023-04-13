export const Span: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  children,
  ...props
}) => {
  return <span {...props}>{children}</span>;
};
