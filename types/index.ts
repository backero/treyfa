import { User, Product, Category, Order, OrderItem, CartItem, WishlistItem, Address, Review } from "@prisma/client";

export type { User, Product, Category, Order, OrderItem, CartItem, WishlistItem, Address, Review };

export type ProductWithCategory = Product & {
  category: Category;
  reviews?: Review[];
};

export type CartItemWithProduct = CartItem & {
  product: Product;
};

export type WishlistItemWithProduct = WishlistItem & {
  product: Product;
};

export type OrderWithDetails = Order & {
  items: (OrderItem & { product: Product })[];
  address: Address;
  user?: User;
};

export type CartState = {
  items: CartItemState[];
  isLoading: boolean;
};

export type CartItemState = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  stock: number;
};

export type WishlistState = {
  items: WishlistItemState[];
  isLoading: boolean;
};

export type WishlistItemState = {
  id: string;
  productId: string;
  name: string;
  price: number;
  comparePrice?: number | null;
  image: string;
};

export type FilterState = {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
};

export type DashboardStats = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: OrderWithDetails[];
  revenueByMonth: { month: string; revenue: number }[];
};

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
