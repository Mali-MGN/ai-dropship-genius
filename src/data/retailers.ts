
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
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/AliExpress_logo.svg/1024px-AliExpress_logo.svg.png", 
    url: "https://www.aliexpress.com/",
    description: "Popular global marketplace with millions of products at competitive prices"
  },
  { 
    id: "amazon", 
    name: "Amazon", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png", 
    url: "https://www.amazon.com/",
    description: "Massive selection and fast shipping options for Prime members"
  },
  { 
    id: "shopify", 
    name: "Shopify", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/2560px-Shopify_logo_2018.svg.png", 
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
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJt5x7xSgSx_6NcHf4dtTrN_MlCjwrBXMG2w&usqp=CAU", 
    url: "https://cjdropshipping.com/",
    description: "Product sourcing, fulfillment, and shipping services worldwide"
  }
];
