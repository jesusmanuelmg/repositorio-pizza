export interface Database {
  public: {
    Tables: {
      pizzas: { Row: Pizza; Insert: Omit<Pizza, 'id' | 'created_at'>; Update: Partial<Pizza> };
      toppings: { Row: Topping; Insert: Omit<Topping, 'id' | 'created_at'>; Update: Partial<Topping> };
      orders: { Row: Order; Insert: Omit<Order, 'id' | 'created_at'>; Update: Partial<Order> };
      order_items: { Row: OrderItem; Insert: Omit<OrderItem, 'id' | 'created_at'>; Update: Partial<OrderItem> };
      order_item_toppings: { Row: OrderItemTopping; Insert: Omit<OrderItemTopping, 'id'>; Update: Partial<OrderItemTopping> };
    };
  };
}

export interface Pizza {
  id: string;
  name: string;
  description: string;
  base_price: number;
  image_url: string;
  category: string;
  popular: boolean;
  created_at: string;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  category: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  status: string;
  total: number;
  notes: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  pizza_id: string;
  pizza_name: string;
  size: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface OrderItemTopping {
  id: string;
  order_item_id: string;
  topping_id: string;
  topping_name: string;
  price: number;
}

export type PizzaSize = 'small' | 'medium' | 'large';

export const SIZE_LABELS: Record<PizzaSize, string> = {
  small: 'Personal (20cm)',
  medium: 'Mediana (30cm)',
  large: 'Grande (40cm)',
};

export const SIZE_MULTIPLIERS: Record<PizzaSize, number> = {
  small: 0.8,
  medium: 1,
  large: 1.35,
};

export interface CartItem {
  id: string; // local uuid
  pizza: Pizza;
  size: PizzaSize;
  quantity: number;
  toppings: Topping[];
  unitPrice: number;
}
