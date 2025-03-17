
export interface RetailerInfo {
  id: string;
  name: string;
  logo: string;
  url: string;
  description: string;
}

// Popular retailers for dropshipping
export const retailers: RetailerInfo[] = [
  { 
    id: "aliexpress", 
    name: "AliExpress", 
    logo: "https://cdn.worldvectorlogo.com/logos/aliexpress-logo.svg", 
    url: "https://www.aliexpress.com/",
    description: "Popular global marketplace with millions of products at competitive prices"
  },
  { 
    id: "amazon", 
    name: "Amazon", 
    logo: "https://cdn.worldvectorlogo.com/logos/amazon-2.svg", 
    url: "https://www.amazon.com/",
    description: "Massive selection and fast shipping options for Prime members"
  },
  { 
    id: "shopify", 
    name: "Shopify", 
    logo: "https://cdn.worldvectorlogo.com/logos/shopify.svg", 
    url: "https://www.shopify.com/",
    description: "Platform to easily set up your own dropshipping store"
  },
  { 
    id: "spocket", 
    name: "Spocket", 
    logo: "https://cdn.shopify.com/app-store/listing_images/7b9e2b842ba1dd353e2cef7fcdcbcd45/icon/COPUmvjytfgCEAE=.png", 
    url: "https://www.spocket.co/",
    description: "Curated marketplace of US and EU suppliers with fast shipping"
  },
  { 
    id: "cjdropshipping", 
    name: "CJ Dropshipping", 
    logo: "https://play-lh.googleusercontent.com/XqqUT5cmgf7CpZvXLVipRgNrbxk-bm4NbfxQiGZMvfVGuiQMC-JJPaJFfEqLmm_YXjo", 
    url: "https://cjdropshipping.com/",
    description: "Product sourcing, fulfillment, and shipping services worldwide"
  }
];
