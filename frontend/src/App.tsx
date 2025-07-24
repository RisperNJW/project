import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ChatBot from './components/chat/ChatBot';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Explore from './pages/Explore';
import Stays from './pages/Stays';
import Meals from './pages/Meals';
import Transport from './pages/Transport';
import Beaches from './pages/Beaches';
import Culture from './pages/Culture';
import Experiences from './pages/Experiences'
import Search from './pages/Search';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Booking from './pages/Booking';
import BookingForm from './pages/BookingForm';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Onboard from './pages/Onboard';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/stays" element={<Stays />} />
                <Route path="/meals" element={<Meals />} />
                <Route path="/transport" element={<Transport />} />
                <Route path="/experiences" element={<Experiences/>} />
                <Route path="/beaches" element={<Beaches />} />
                <Route path="/culture" element={<Culture />} />
                <Route path="/search" element={<Search />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Auth Routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                
                {/* Cart & Booking Routes */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/booking/:id" element={<Booking />} />
                <Route path="/booking-form" element={<BookingForm />} />
                <Route path="/payment" element={<Payment />} />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Provider Routes */}
                <Route path="/provider/*" element={<ProviderDashboard />} />
                <Route path="/onboard" element={<Onboard />} />
              </Routes>
            </main>
            <Footer />
            <ChatBot />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
