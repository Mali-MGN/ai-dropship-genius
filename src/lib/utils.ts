
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function getSEOMetadata(title: string, description: string) {
  return {
    title: `${title} | AI Dropship Genius`,
    description,
    keywords: "dropshipping, AI, ecommerce, supabase integration, product discovery, store management",
    ogImage: "/og-image.png"
  };
}
