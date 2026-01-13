/* eslint-disable @typescript-eslint/no-explicit-any */
export const FontAwesomeIcon = ({ className, children, ...props }: { className?: string; children: any }) => {
  return (
    <i className={`fa ${className}`} {...props}>
      {children}
    </i>
  );
};
