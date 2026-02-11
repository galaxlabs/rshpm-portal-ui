import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeLabel(text: string) {
  return text.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

export function toDoctypeSlug(doctype: string) {
  return doctype.toLowerCase().replace(/\s+/g, '-');
}

export function fromDoctypeSlug(slug: string, names: string[]) {
  const mapped = slug.replace(/-/g, ' ');
  return names.find((name) => name.toLowerCase() === mapped) ?? names[0];
}
