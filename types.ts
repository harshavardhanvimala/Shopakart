
export type Role = 'BUYER' | 'SELLER';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  category?: string;
}

export interface ShopStory {
  id: string;
  imageUrl: string;
  timestamp: string;
}

export interface Shop {
  id: string;
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
  products: Product[];
  rating: number;
  reviews: number;
  stories: ShopStory[];
  viewsToday: number;
}

// Added 'PROFILE' to AppView to support navigation items and fix casting errors
export type AppView = 'ONBOARDING' | 'HOME' | 'SHOP_DETAIL' | 'SELLER_HUB' | 'CHAT_LIST' | 'CHAT_DETAIL' | 'MANAGE_SHOP' | 'PROFILE';

export interface LocationState {
  lat: number | null;
  lng: number | null;
  address: string;
  loading: boolean;
  error: string | null;
}
