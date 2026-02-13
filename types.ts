
export type Role = 'BUYER' | 'SELLER';

export type AppView = 
  | 'ONBOARDING' 
  | 'SIGN_IN'
  | 'SIGN_UP'             // New: Sign Up Flow
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
  | 'MERCHANT_PREVIEW'
  | 'MERCHANT_INBOX'
  | 'MERCHANT_CUSTOMERS'
  | 'SHOPPER_DEALS'
  | 'SHOPPER_STORES'
  | 'SHOPPER_PLUS'
  | 'SHOPPER_FAVORITES'
  | 'SHOPPER_CHATS'
  | 'SHOPPER_CONTRIBUTIONS'
  | 'SHOPPER_HISTORY'
  | 'NOTIFICATIONS'
  | 'SHOPPER_PRICE_TRACKER';

export interface ShopStory {
  id: string;
  imageUrl: string;
  timestamp: string;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  unit: string;
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
  rating: number;
  reviews: number;
  viewsToday: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  stories: ShopStory[];
  products: Product[];
}

export interface VisitListItem {
  productId: string;
  shopId: string;
  quantity: number;
}

export interface Deal {
  id: string;
  name: string;
  discount: string;
  type: string;
  status: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  senderId?: string;
  text?: string;
  time: string;
  lastMsg?: string;
  online?: boolean;
}

export interface LocationState {
  lat: number;
  lng: number;
  address: string;
  loading: boolean;
  error: string | null;
}

export interface AppData {
  shops: Shop[];
  products: Product[];
  visitList: VisitListItem[];
  deals: Deal[];
  favorites: string[];
  notifications: NotificationItem[];
  chats: ChatMessage[];
}
