import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type WishlistItem = {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
};

// type WishlistState = {
//     items: WishlistItem[];
// };

const savedWishlist = localStorage.getItem("wishlist");

const initialState = {
    items: savedWishlist ? JSON.parse(savedWishlist) : []
};



const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
            const exists = state.items.find((item: { id: number; }) => item.id === action.payload.id);
            if (!exists) {
                state.items.push(action.payload);
            }
            localStorage.setItem("wishlist", JSON.stringify(state.items));
        },

        removeFromWishlist: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item: { id: number; }) => item.id !== action.payload);
            localStorage.setItem("wishlist", JSON.stringify(state.items));
        }
    }
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;