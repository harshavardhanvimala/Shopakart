
export type Role = 'BUYER' | 'SELLER';

export interface Product {
  id: string;
  shopId: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  unit: string; // e.g., "pcs", "kg", "loaf"
}

export interface ShopStory {
  id: string;
  imageUrl: string;
  timestamp: string;
}

export interface Shop {
  id: string;
  sellerId: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  imageUrl: string;
  isOpen: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviews: number;
  viewsToday: number;
  stories: ShopStory[];
  products: Product[];
}

export interface VisitListItem {
  productId: string;
  shopId: string;
  quantity: number;
}

// Added AppData interface to fix database service typing errors
export interface AppData {
  shops: Shop[];
  products: Product[];
  visitList: VisitListItem[];
}

export type AppView = 
  | 'ONBOARDING' 
  | 'SIGN_IN'
  | 'HOME' 
  | 'SHOP_DETAIL' 
  | 'SELLER_HUB' 
  | 'MANAGE_SHOP' 
  | 'MANAGE_INVENTORY' 
  | 'PRICE_COMPARE'
  | 'VISIT_LIST'
  | 'PROFILE'
  | 'CHAT'
  | 'MERCHANT_DEALS'
  | 'MERCHANT_STORES'
  | 'MERCHANT_PLUS'
  | 'SHOPPER_DEALS'
  | 'SHOPPER_STORES'
  | 'SHOPPER_PLUS'
  | 'SHOPPER_FAVORITES'
  | 'SHOPPER_CHATS'
  | 'SHOPPER_CONTRIBUTIONS'
  | 'SHOPPER_HISTORY'
  | 'NOTIFICATIONS'
  | 'SHOPPER_PRICE_TRACKER';

export interface LocationState {
  lat: number | null;
  lng: number | null;
  address: string;
  loading: boolean;
  error: string | null;
}
