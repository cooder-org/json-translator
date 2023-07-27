import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function md5sum(text: string) {
  const md5 = crypto.createHash('md5');
  return md5.update(text).digest('hex')
}
