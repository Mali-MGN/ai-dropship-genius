
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

// Hypothetical function to generate personalized product recommendations
export function getPersonalizedRecommendations(
  userPreferences: UserPreferences,
  productCatalog: Product[]
): Product[] {
  // This would use some algorithm to match products with user preferences
  // This is a simplified example
  return productCatalog.filter(product => {
    // Check if product category matches user interests
    const categoryMatch = userPreferences.interests.some(
      interest => product.category.toLowerCase().includes(interest.toLowerCase())
    );
    
    // Check if product price is within user's budget range
    const priceMatch = product.price >= userPreferences.priceRange.min && 
                      product.price <= userPreferences.priceRange.max;
    
    return categoryMatch && priceMatch;
  });
}

// Type definitions for the function above
export interface UserPreferences {
  interests: string[];
  priceRange: {
    min: number;
    max: number;
  };
  enablePersonalization: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  trending: boolean;
}
