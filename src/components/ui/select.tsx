import { cn } from '@/lib/utils';
import type { SelectHTMLAttributes } from 'react';

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-md border border-border bg-slate-900/65 px-3 text-sm text-foreground outline-none focus-visible:ring-2',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
