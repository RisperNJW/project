import React, { createContext, useContext, useReducer } from 'react';

interface PaymentState {
  processing: boolean;
  error: string | null;
  lastTransaction: any | null;
}

interface PaymentContextType extends PaymentState {
  processPayment: (paymentData: any) => Promise<void>;
  clearError: () => void;
}

type PaymentAction =
  | { type: 'PAYMENT_START' }
  | { type: 'PAYMENT_SUCCESS'; payload: any }
  | { type: 'PAYMENT_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: PaymentState = {
  processing: false,
  error: null,
  lastTransaction: null,
};

const paymentReducer = (state: PaymentState, action: PaymentAction): PaymentState => {
  switch (action.type) {
    case 'PAYMENT_START':
      return { ...state, processing: true, error: null };
    case 'PAYMENT_SUCCESS':
      return { 
        ...state, 
        processing: false, 
        lastTransaction: action.payload,
        error: null 
      };
    case 'PAYMENT_ERROR':
      return { 
        ...state, 
        processing: false, 
        error: action.payload 
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const processPayment = async (paymentData: any) => {
    dispatch({ type: 'PAYMENT_START' });
    
    try {
      // Payment processing logic would go here
      // This is a placeholder implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transaction = {
        id: Date.now().toString(),
        amount: paymentData.amount,
        status: 'completed',
        timestamp: new Date().toISOString()
      };
      
      dispatch({ type: 'PAYMENT_SUCCESS', payload: transaction });
    } catch (error: any) {
      dispatch({ type: 'PAYMENT_ERROR', payload: error.message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: PaymentContextType = {
    ...state,
    processPayment,
    clearError,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};