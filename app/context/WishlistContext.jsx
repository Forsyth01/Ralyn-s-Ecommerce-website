"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "react-toastify";

const WishlistContext = createContext();

const initialState = {
  items: [],
  isOpen: false,
};

function wishlistReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (exists) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "TOGGLE_WISHLIST":
      return { ...state, isOpen: !state.isOpen };

    case "OPEN_WISHLIST":
      return { ...state, isOpen: true };

    case "CLOSE_WISHLIST":
      return { ...state, isOpen: false };

    case "CLEAR_WISHLIST":
      return { ...state, items: [] };

    case "LOAD_WISHLIST":
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("raylns-wishlist");
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        dispatch({ type: "LOAD_WISHLIST", payload: parsedWishlist });
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("raylns-wishlist", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product) => {
    const exists = state.items.some((item) => item.id === product.id);
    if (exists) {
      toast.info(`${product.name} is already in your wishlist`, { toastId: "wishlist-action" });
      return;
    }
    dispatch({ type: "ADD_ITEM", payload: product });
    toast.success(`${product.name} added to wishlist`, { toastId: "wishlist-action" });
  };

  const removeItem = (productId) => {
    const item = state.items.find((item) => item.id === productId);
    dispatch({ type: "REMOVE_ITEM", payload: productId });
    if (item) {
      toast.info(`${item.name} removed from wishlist`, { toastId: "wishlist-action" });
    }
  };

  const toggleItem = (product) => {
    const exists = state.items.some((item) => item.id === product.id);
    if (exists) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  const isInWishlist = (productId) => {
    return state.items.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
    toast.success("Wishlist cleared", { toastId: "wishlist-action" });
  };

  const toggleWishlist = () => dispatch({ type: "TOGGLE_WISHLIST" });
  const openWishlist = () => dispatch({ type: "OPEN_WISHLIST" });
  const closeWishlist = () => dispatch({ type: "CLOSE_WISHLIST" });

  const itemCount = state.items.length;

  const value = {
    items: state.items,
    isOpen: state.isOpen,
    addItem,
    removeItem,
    toggleItem,
    isInWishlist,
    clearWishlist,
    toggleWishlist,
    openWishlist,
    closeWishlist,
    itemCount,
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
