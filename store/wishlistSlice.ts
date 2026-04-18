import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WishlistItemState, WishlistState } from "@/types";

const initialState: WishlistState = {
  items: [],
  isLoading: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlistItems(state, action: PayloadAction<WishlistItemState[]>) {
      state.items = action.payload;
    },
    addToWishlist(state, action: PayloadAction<WishlistItemState>) {
      const exists = state.items.find((i) => i.productId === action.payload.productId);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    clearWishlist(state) {
      state.items = [];
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setWishlistItems, addToWishlist, removeFromWishlist, clearWishlist, setLoading } =
  wishlistSlice.actions;

export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist.items;
export const selectWishlistCount = (state: { wishlist: WishlistState }) =>
  state.wishlist.items.length;
export const selectIsWishlisted = (productId: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist.items.some((i) => i.productId === productId);

export default wishlistSlice.reducer;
