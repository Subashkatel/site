import type { ReactNode } from 'react';

type RowProps = {
  /* What sits in the left rail: a section label, or dates on an essay. */
  rail?: ReactNode;
  className?: string;
  children: ReactNode;
};

/* One row of the page: the rail on the left, the text column on the right. */
export function Row({ rail, className, children }: RowProps) {
  const rowClassName = className ? `row ${className}` : 'row';
  return (
    <div className={rowClassName}>
      <div className="rail">{rail}</div>
      <div className="column">{children}</div>
    </div>
  );
}
