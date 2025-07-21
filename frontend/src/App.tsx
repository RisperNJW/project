import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ChatBot from './components/chat/ChatBot';

// Pages (frontend working without APIs)
import Home from './pages/Home';
import Services from './pages/Services';
import Explore from './pages/Explore';
import Stays from './pages/Stays';
import Meals from './pages/Meals';
import Transport from './pages/Transport';
import ProviderDashboard from './pages/ProviderDashboard'; 
import Onboard from "./pages/Onboard"; 
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import { AuthProvider } from './contexts/AuthContext';



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/stays" element={<Stays />} />
              <Route path="/meals" element={<Meals />} />
              <Route path="/transport" element={<Transport />} />
              <Route path="/provider/*" element={<ProviderDashboard />} />
              <Route path="/onboard" element={<Onboard />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

            </Routes>
          </main>
          <Footer />
          <ChatBot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
