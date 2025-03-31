
export interface RetailerInfo {
  id: string;
  name: string;
  logo: string;
  url: string;
  description: string;
}

export const retailers: RetailerInfo[] = [
  {
    id: "shopify",
    name: "Shopify",
    logo: "/placeholder.svg?height=64&width=64",
    url: "https://shopify.com",
    description: "Connect your Shopify store",
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    logo: "/placeholder.svg?height=64&width=64",
    url: "https://woocommerce.com",
    description: "Connect your WooCommerce store",
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "/placeholder.svg?height=64&width=64",
    url: "https://sellercentral.amazon.com",
    description: "Connect your Amazon seller account",
  },
  {
    id: "etsy",
    name: "Etsy",
    logo: "/placeholder.svg?height=64&width=64",
    url: "https://etsy.com/your/shops",
    description: "Connect your Etsy shop",
  },
];
