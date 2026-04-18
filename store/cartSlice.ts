import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItemState, CartState } from "@/types";

const initialState: CartState = {
  items: [],
  isLoading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems(state, action: PayloadAction<CartItemState[]>) {
      state.items = action.payload;
    },
    addToCart(state, action: PayloadAction<CartItemState>) {
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + action.payload.quantity, existing.stock);
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        item.quantity = Math.min(Math.max(1, action.payload.quantity), item.stock);
      }
    },
    clearCart(state) {
      state.items = [];
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setCartItems, addToCart, removeFromCart, updateQuantity, clearCart, setLoading } =
  cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartLoading = (state: { cart: CartState }) => state.cart.isLoading;

export default cartSlice.reducer;
