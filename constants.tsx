
import React from 'react';
import { ShoppingBag, Coffee, Utensils, Zap, Shirt, Heart, Car, Wrench } from 'lucide-react';
import { Shop } from './types';

export const CATEGORIES = [
  { id: 'retail', name: 'Retail', icon: <ShoppingBag size={18} /> },
  { id: 'cafe', name: 'Cafe', icon: <Coffee size={18} /> },
  { id: 'restaurant', name: 'Restaurant', icon: <Utensils size={18} /> },
  { id: 'electronics', name: 'Electronics', icon: <Zap size={18} /> },
  { id: 'fashion', name: 'Fashion', icon: <Shirt size={18} /> },
  { id: 'health', name: 'Health', icon: <Heart size={18} /> },
  { id: 'auto', name: 'Automotive', icon: <Car size={18} /> },
  { id: 'services', name: 'Services', icon: <Wrench size={18} /> },
];

export const THEMED_TRAILS = [
  { id: 't1', name: 'Street Food Row', description: 'The best local bites', color: 'bg-orange-500' },
  { id: 't2', name: 'Fresh Morning', description: 'Early morning veggie markets', color: 'bg-emerald-500' },
  { id: 't3', name: 'Tech Alley', description: 'Gadgets and repairs', color: 'bg-blue-500' }
];

export const MOCK_SHOPS: Shop[] = [
  {
    id: '1',
    // Added missing sellerId to satisfy Shop interface requirements
    sellerId: 'seller-1',
    name: 'The Daily Grind',
    category: 'Cafe',
    description: 'Artisanal coffee and fresh pastries in the heart of downtown.',
    address: '123 Main St, Central City',
    phone: '+1 555-0101',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800',
    isOpen: true,
    rating: 4.8,
    reviews: 124,
    viewsToday: 432,
    coordinates: { lat: 40.7128, lng: -74.006 },
    stories: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=200', timestamp: '2h ago' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=200', timestamp: '5h ago' }
    ],
    products: [
      // Fix: Added missing fields (shopId, category, unit) to satisfy the Product interface
      { id: 'p1', shopId: '1', name: 'Cold Brew', price: 4.5, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=200', category: 'Cafe', unit: 'cup' },
      { id: 'p2', shopId: '1', name: 'Avocado Toast', price: 12.0, stock: 15, imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=200', category: 'Cafe', unit: 'slice' }
    ]
  },
  {
    id: '2',
    // Added missing sellerId to satisfy Shop interface requirements
    sellerId: 'seller-2',
    name: 'Tech Haven',
    category: 'Electronics',
    description: 'Your one-stop shop for the latest gadgets and professional repair services.',
    address: '456 Tech Blvd, Innovation District',
    phone: '+1 555-0102',
    imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800',
    isOpen: false,
    rating: 4.5,
    reviews: 89,
    viewsToday: 156,
    coordinates: { lat: 40.7200, lng: -74.010 },
    stories: [],
    products: [
      // Fix: Added missing fields (shopId, category, unit) to satisfy the Product interface
      { id: 'p4', shopId: '2', name: 'Wireless Earbuds', price: 129.99, stock: 24, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200', category: 'Electronics', unit: 'pcs' }
    ]
  }
];
