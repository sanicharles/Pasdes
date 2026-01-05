
export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export interface User {
  id: string;
  name: string;
  whatsapp: string;
  village: string;
  role: UserRole;
  isVerified: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  village: string;
  imageUrl: string;
  videoUrl?: string;
  videoDuration?: number;
  seller: User;
  createdAt: number;
}

export interface Order {
  id:string;
  product: Product;
  seller: User;
  buyerName: string;
  buyerWhatsapp: string;
  createdAt: number;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}