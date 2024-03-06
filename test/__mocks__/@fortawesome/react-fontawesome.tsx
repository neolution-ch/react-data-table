/* eslint-disable @typescript-eslint/no-explicit-any */
export function FontAwesomeIcon({ className, children, ...props }: { className?: string; children: any }) {
  return (
    <i className={`fa ${className}`} {...props}>
      {children}
    </i>
  );
}
