import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentFormProps {
  bookingId: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
}

const StripePaymentForm: React.FC<{
  bookingId: string;
  amount: number;
  onSuccess: () => void;
}> = ({ bookingId, amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const { data } = await axios.post('/api/payments/stripe/create-payment-intent', {
        bookingId,
      });

      // Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        toast.error(result.error.message || 'Payment failed');
      } else {
        toast.success('Payment successful!');
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <CreditCard size={20} />
        {isProcessing ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
};

const MpesaPaymentForm: React.FC<{
  bookingId: string;
  amount: number;
  onSuccess: () => void;
}> = ({ bookingId, amount, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    try {
      const response = await axios.post('/api/payments/mpesa/stk-push', {
        phoneNumber,
        amount,
        bookingId,
      });

      toast.success('STK push sent! Please check your phone and enter your M-Pesa PIN.');
      
      // Poll for payment status
      const checkPaymentStatus = async () => {
        try {
          const statusResponse = await axios.get(`/api/payments/verify/${bookingId}`);
          if (statusResponse.data.booking.paymentStatus === 'completed') {
            toast.success('Payment successful!');
            onSuccess();
          } else if (statusResponse.data.booking.paymentStatus === 'failed') {
            toast.error('Payment failed. Please try again.');
            setIsProcessing(false);
          } else {
            // Continue polling
            setTimeout(checkPaymentStatus, 3000);
          }
        } catch (error) {
          console.error('Payment status check failed:', error);
          setIsProcessing(false);
        }
      };

      setTimeout(checkPaymentStatus, 5000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'M-Pesa payment failed');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          M-Pesa Phone Number
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+254700000000"
          pattern="^\+254[0-9]{9}$"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter your M-Pesa registered phone number
        </p>
      </div>
      
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <Smartphone size={20} />
        {isProcessing ? 'Processing...' : `Pay KES ${Math.round(amount * 110)}`}
      </button>
    </form>
  );
};

const PaymentForm: React.FC<PaymentFormProps> = ({ bookingId, amount, currency, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'mpesa'>('stripe');

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-6">Complete Your Payment</h3>
      
      {/* Payment Method Selection */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setPaymentMethod('stripe')}
            className={`flex-1 p-3 border rounded-lg flex items-center justify-center gap-2 transition-colors ${
              paymentMethod === 'stripe'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <CreditCard size={20} />
            Credit Card
          </button>
          <button
            onClick={() => setPaymentMethod('mpesa')}
            className={`flex-1 p-3 border rounded-lg flex items-center justify-center gap-2 transition-colors ${
              paymentMethod === 'mpesa'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Smartphone size={20} />
            M-Pesa
          </button>
        </div>
      </div>

      {/* Payment Forms */}
      {paymentMethod === 'stripe' ? (
        <Elements stripe={stripePromise}>
          <StripePaymentForm
            bookingId={bookingId}
            amount={amount}
            onSuccess={onSuccess}
          />
        </Elements>
      ) : (
        <MpesaPaymentForm
          bookingId={bookingId}
          amount={amount}
          onSuccess={onSuccess}
        />
      )}

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          🔒 Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;