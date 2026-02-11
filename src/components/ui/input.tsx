import { cn } from '@/lib/utils';
import type { InputHTMLAttributes } from 'react';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-md border border-border bg-slate-900/65 px-3 text-sm text-foreground outline-none ring-offset-background placeholder:text-slate-400 focus-visible:ring-2',
        className,
      )}
      {...props}
    />
  );
}
