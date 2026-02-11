import { cn } from '@/lib/utils';
import type { TextareaHTMLAttributes } from 'react';

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-24 w-full rounded-md border border-border bg-slate-900/65 px-3 py-2 text-sm text-foreground outline-none placeholder:text-slate-400 focus-visible:ring-2',
        className,
      )}
      {...props}
    />
  );
}
