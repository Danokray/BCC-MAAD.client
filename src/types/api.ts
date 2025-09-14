// Типы для API запросов и ответов

// Auth API Types
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  clientCode: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: number; // Опциональное поле для совместимости с mock API
}

export interface User {
  id: string;
  client_code: string;
  name: string;
  status: string;
  city: string;
  age?: number;
  created_at?: string;
}

// Client API Types
export interface ClientProfile {
  name: string;
  age: number;
  status: string;
  average_balance: number;
  city: string;
  // Дополнительные поля для .NET Backend
  id?: number;
  client_code?: number;
  email?: string;
  phone?: string;
  address?: string;
  created_at?: string;
}

export interface Balance {
  current_balance: number;
  currency: string;
  last_updated: string;
  // Дополнительные поля для .NET Backend
  account_number?: string;
  balance?: number;
  available_balance?: number;
}

// Transaction API Types
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  status: string;
  reference: string;
  // Дополнительные поля для .NET Backend
  client_code?: number;
  type?: 'credit' | 'debit';
  created_at?: string;
  updated_at?: string;
}

export interface CreateTransactionRequest {
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  description: string;
  // Дополнительные поля для .NET Backend
  reference?: string;
  status?: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  // Дополнительные поля для .NET Backend
  client_code?: number;
  page?: number;
  page_size?: number;
}

export interface TransactionDto {
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  description: string;
  reference?: string;
  status?: string;
}

// Transfer API Types
export interface Transfer {
  id: string;
  type: string;
  amount: number;
  recipient: string;
  recipient_account: string;
  description: string;
  date: string;
  status: string;
  reference: string;
  // Дополнительные поля для .NET Backend
  client_code?: number;
  sender_account?: string;
  currency?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTransferRequest {
  toAccount: string;
  amount: number;
  currency: string;
  description: string;
}

export interface TransfersResponse {
  transfers: Transfer[];
  total: number;
  // Дополнительные поля для .NET Backend
  client_code?: number;
  page?: number;
  page_size?: number;
}

export interface TransferDto {
  amount: number;
  recipient: string;
  recipient_account: string;
  description: string;
  reference?: string;
  status?: string;
  currency?: string;
}

// Push API Types
export interface PushNotification {
  id: string;
  message: string;
  type: string;
  created_at: string;
  read: boolean;
}

export interface Recommendation {
  product_name: string;
  push_text: string;
  category: string;
  priority: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
