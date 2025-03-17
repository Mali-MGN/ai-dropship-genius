
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  trending: boolean;
  profitMargin: number;
  source: string;
  comparePrice: number;
  createdAt: string;
  updatedAt: string;
  productUrl: string;
  inStock: boolean;
}

interface RetailerInfo {
  id: string;
  name: string;
  logo: string;
  url: string;
  description: string;
}

interface ProductGridProps {
  title: string;
  description: string;
  products: ProductData[];
  loading: boolean;
  onImport: (id: string) => void;
  onExport: (id: string) => void;
  importing: Record<string, boolean>;
  exporting: Record<string, boolean>;
  selectedRetailer: string | null;
  retailers: RetailerInfo[];
}

// Sample products with real images and descriptions to show when no products are found
const sampleProducts: ProductData[] = [
  {
    id: "sample-1",
    name: "Wireless Noise Cancelling Earbuds",
    description: "Premium wireless earbuds with active noise cancellation, touch controls, and 24-hour battery life with charging case.",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop",
    category: "Electronics",
    tags: ["wireless", "audio", "trending"],
    rating: 4.7,
    reviewCount: 356,
    trending: true,
    profitMargin: 35,
    source: "Sample Store",
    comparePrice: 129.99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    productUrl: "#",
    inStock: true
  },
  {
    id: "sample-2",
    name: "Smart Fitness Tracker Watch",
    description: "Track your health metrics, workouts, sleep quality and receive notifications. Water resistant and 7-day battery life.",
    price: 59.99,
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop",
    category: "Electronics",
    tags: ["fitness", "smart watch", "health"],
    rating: 4.5,
    reviewCount: 289,
    trending: true,
    profitMargin: 42,
    source: "Sample Store",
    comparePrice: 79.99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    productUrl: "#",
    inStock: true
  },
  {
    id: "sample-3",
    name: "Portable Bluetooth Speaker",
    description: "Compact waterproof speaker with immersive 360° sound, 12-hour playtime, and built-in microphone for calls.",
    price: 45.99,
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop",
    category: "Electronics",
    tags: ["audio", "portable", "bluetooth"],
    rating: 4.3,
    reviewCount: 175,
    trending: false,
    profitMargin: 38,
    source: "Sample Store",
    comparePrice: 65.99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    productUrl: "#",
    inStock: true
  }
];

export function ProductGrid({
  title,
  description,
  products,
  loading,
  onImport,
  onExport,
  importing,
  exporting,
  selectedRetailer,
  retailers
}: ProductGridProps) {
  // Use sample products if no products were found
  const displayProducts = products.length > 0 ? products : sampleProducts;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Loading products...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onImport={onImport}
                onExport={onExport}
                importing={importing[product.id] || false}
                exporting={exporting[product.id] || false}
                selectedRetailer={selectedRetailer}
                retailers={retailers}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
