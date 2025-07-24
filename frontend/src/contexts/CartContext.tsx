import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  _id?: string;
  serviceId: string;
  serviceName: string;
  category: string;
  price: number;
  image: string;
  providerId: string;
  providerName: string;
  quantity: number;
  guests: number;
  startDate?: string;
  endDate?: string;
  specialRequests?: string;
}

interface AddToCartItem {
  serviceId: string;
  serviceName: string;
  category: string;
  price: number;
  image: string;
  providerId: string;
  providerName: string;
  quantity: number;
  guests: number;
  startDate?: string;
  endDate?: string;
  specialRequests?: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
}

interface CartContextType extends CartState {
  addToCart: (item: AddToCartItem) => Promise<void>;
  updateCartItem: (itemId: string, updates: Partial<CartItem>) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: { items: CartItem[]; totalAmount: number } }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { itemId: string; updates: Partial<CartItem> } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        totalAmount: action.payload.totalAmount,
        totalItems: action.payload.items.length,
        loading: false,
        error: null
      };
    case 'ADD_ITEM':
      const newItems = [...state.items, action.payload];
      return {
        ...state,
        items: newItems,
        totalItems: newItems.length,
        totalAmount: newItems.reduce((sum, item) => sum + item.price, 0)
      };
    case 'UPDATE_ITEM':
      const updatedItems = state.items.map(item =>
        item._id === action.payload.itemId
          ? { ...item, ...action.payload.updates }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        totalAmount: updatedItems.reduce((sum, item) => sum + item.price, 0)
      };
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item._id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.length,
        totalAmount: filteredItems.reduce((sum, item) => sum + item.price, 0)
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalAmount: 0,
        totalItems: 0
      };
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  loading: false,
  error: null
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { token } = useAuth();

  const apiCall = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(`/api${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  };

  const refreshCart = async () => {
    if (!token) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await apiCall('/cart');
      
      dispatch({
        type: 'SET_CART',
        payload: {
          items: data.items || [],
          totalAmount: data.totalAmount || 0
        }
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const addToCart = async (item: AddToCartItem) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const data = await apiCall('/cart/add', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          category: item.category,
          price: item.price,
          image: item.image,
          providerId: item.providerId,
          providerName: item.providerName,
          quantity: item.quantity,
          startDate: item.startDate,
          endDate: item.endDate,
          guests: item.guests,
          specialRequests: item.specialRequests
        })
      });

      dispatch({
        type: 'SET_CART',
        payload: {
          items: data.cart.items,
          totalAmount: data.cart.totalAmount
        }
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const updateCartItem = async (itemId: string, updates: Partial<CartItem>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const data = await apiCall(`/cart/item/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      dispatch({
        type: 'SET_CART',
        payload: {
          items: data.cart.items,
          totalAmount: data.cart.totalAmount
        }
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const data = await apiCall(`/cart/item/${itemId}`, {
        method: 'DELETE'
      });

      dispatch({
        type: 'SET_CART',
        payload: {
          items: data.cart.items,
          totalAmount: data.cart.totalAmount
        }
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await apiCall('/cart/clear', {
        method: 'DELETE'
      });

      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  useEffect(() => {
    if (token) {
      refreshCart();
    }
  }, [token]);

  const value: CartContextType = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
