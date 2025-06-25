import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  if (!name) return '?';

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return (words[0][0] + words[1][0]).toUpperCase();
}

export function generateRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}
