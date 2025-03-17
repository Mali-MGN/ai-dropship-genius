
export interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  status: string;
  order_date: string;
  tracking_number: string | null;
  tracking_url: string | null;
  product: {
    name: string;
  } | null;
  retailer: {
    name: string;
  } | null;
}

export interface OrderDetails {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  amount: number;
  cost: number;
  profit: number;
  status: string;
  order_date: string;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  product: {
    id: string;
    name: string;
    image_url: string | null;
  };
  retailer: {
    name: string;
  };
}
