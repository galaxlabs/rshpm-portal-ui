import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full border border-border bg-slate-900/70 px-2 py-1 text-xs text-slate-200', className)}
      {...props}
    />
  );
}
