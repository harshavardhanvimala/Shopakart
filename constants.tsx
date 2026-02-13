
import React from 'react';
import { ShoppingBag, Coffee, Utensils, Apple, Cake, Pizza } from 'lucide-react';
import { Shop } from './types';

export const CATEGORIES = [
  { id: 'grocery', name: 'Grocery', icon: <Apple size={18} /> },
  { id: 'cafe', name: 'Cafe', icon: <Coffee size={18} /> },
  { id: 'restaurant', name: 'Restaurant', icon: <Utensils size={18} /> },
  { id: 'bakery', name: 'Bakery', icon: <Cake size={18} /> },
  { id: 'streetfood', name: 'Street Food', icon: <Pizza size={18} /> },
];

export const THEMED_TRAILS = [
  { id: 't1', name: 'Street Food Row', description: 'The best local bites', color: 'bg-orange-500' },
  { id: 't2', name: 'Fresh Morning', description: 'Early morning veggie markets', color: 'bg-emerald-500' },
  { id: 't3', name: 'Spice Route', description: 'Exotic ingredients and herbs', color: 'bg-amber-600' }
];

export const MOCK_SHOPS: Shop[] = [
  {
    id: '1',
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
      { id: 'p1', shopId: '1', name: 'Cold Brew', price: 4.5, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=200', category: 'Cafe', unit: 'cup' },
      { id: 'p2', shopId: '1', name: 'Avocado Toast', price: 12.0, stock: 15, imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=200', category: 'Cafe', unit: 'slice' }
    ]
  },
  {
    id: '2',
    sellerId: 'seller-2',
    name: 'Organic Orchard',
    category: 'Grocery',
    description: 'Freshly picked organic fruits and vegetables from local sustainable farms.',
    address: '456 Green Blvd, Eco District',
    phone: '+1 555-0102',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    isOpen: true,
    rating: 4.6,
    reviews: 215,
    viewsToday: 890,
    coordinates: { lat: 40.7200, lng: -74.010 },
    stories: [
      { id: 's3', imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=200', timestamp: '1h ago' }
    ],
    products: [
      { id: 'p4', shopId: '2', name: 'Honeycrisp Apples', price: 3.99, stock: 120, imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?auto=format&fit=crop&q=80&w=200', category: 'Grocery', unit: 'kg' },
      { id: 'p5', shopId: '2', name: 'Wildflower Honey', price: 14.50, stock: 45, imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=200', category: 'Grocery', unit: 'jar' }
    ]
  }
];
