# Go2Bookings Platform

A comprehensive service booking, payment processing, AI assistance, and real-time features.

## Project Structure

```
project/
  frontend/   # React + Vite + TypeScript frontend
  server/     # Express + MongoDB backend (JavaScript)
  package.json  # Root scripts and workspace config
  README.md
  ...
```

## Getting Started

### 1. Install Dependencies

From the project root, run:

```sh
pnpm install
```

This will install dependencies for both `frontend` and `server` workspaces.

---

### 2. Running the Development Servers

**Start both frontend and backend (recommended):**

```sh
pnpm run dev
```

- This will run both the frontend (on port 5173) and backend (on port 5000) concurrently.

**Or, run them individually:**

- **Frontend:**
  ```sh
  cd frontend
  pnpm run dev
  ```
- **Backend:**
  ```sh
  cd server
  pnpm run dev
  ```

---

### 3. Building for Production

```sh
pnpm run build
```

- Builds both frontend and backend.

---

### 4. Project Notes

- The backend code is in the `server/` directory (not `backend/`).
- The frontend is a Vite + React + TypeScript app in `frontend/`.
- The root `package.json` manages scripts and workspaces for both.

---

## 🌟 Features

### Core Features
- **Service Discovery**: Browse safaris, beach holidays, mountain climbing, cultural tours
- **Smart Booking System**: Complete booking flow with date selection and guest management
- **Dual Payment Processing**: Stripe for international payments, M-Pesa for local payments
- **AI Tourism Assistant**: OpenAI-powered chatbot for travel guidance
- **Real-time Communication**: Socket.io for live updates and chat
- **User Management**: Role-based access (users, providers, admins)

### Advanced Features
- **Admin Dashboard**: Service approval, user management, analytics
- **Provider Dashboard**: Service management, booking tracking, earnings
- **Mobile-Responsive Design**: Works seamlessly on all devices
- **Security**: JWT authentication, input validation, rate limiting
- **Performance**: Optimized queries, caching, lazy loading

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: Context API + React Query
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Forms**: React Hook Form with validation

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.io
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

### Payment Integration
- **Stripe**: International credit/debit cards
- **M-Pesa**: Kenya mobile money (STK Push)
- **Security**: PCI DSS compliant processing

### AI Features
- **OpenAI GPT-3.5**: Tourism knowledge base
- **Real-time Chat**: Socket.io integration
- **Context-Aware**: Kenya-specific travel information

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6.0+
- Redis 7+ (optional, for caching)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/RisperNJW/project.git
cd project
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the application**
```bash
pnpm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔧 Configuration

### Required Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/kenya-tourism

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# M-Pesa
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_mpesa_passkey

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 📱 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Service Endpoints
- `GET /api/services` - List services with filters
- `GET /api/services/:id` - Get service details
- `POST /api/services` - Create service (providers)
- `PUT /api/services/:id` - Update service
- `POST /api/services/:id/reviews` - Add review

### Booking Endpoints
- `GET /api/bookings` - User's bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Booking details
- `PATCH /api/bookings/:id/cancel` - Cancel booking

### Payment Endpoints
- `POST /api/payments/stripe/create-payment-intent` - Stripe payment
- `POST /api/payments/mpesa/stk-push` - M-Pesa payment
- `GET /api/payments/verify/:bookingId` - Verify payment

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📊 Monitoring & Analytics

### Built-in Analytics
- User registration trends
- Booking patterns
- Revenue tracking
- Service performance
- Geographic distribution

### Health Monitoring
- API health checks
- Database connectivity
- Payment gateway status
- Real-time metrics

## 🔒 Security Features

- **Authentication**: JWT with secure HTTP-only cookies
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API endpoint protection
- **CORS**: Configured for production
- **Helmet**: Security headers
- **Data Encryption**: Sensitive data protection

## 🌍 Internationalization

- **Languages**: English, Swahili
- **Currencies**: USD, KES, EUR, GBP
- **Localization**: Date formats, number formats
- **RTL Support**: Ready for Arabic/Hebrew

## 📈 Performance Optimization

- **Database**: Indexed queries, aggregation pipelines
- **Caching**: Redis for session and data caching
- **CDN**: Static asset delivery
- **Compression**: Gzip/Brotli compression
- **Lazy Loading**: Component and image lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Go2Bookings for inspiration
- OpenAI for AI capabilities
- Stripe and Safaricom for payment processing
- The amazing open-source community

## 📞 Support

For support, email Go2Bookings.com or join our Slack channel.

---

**Made with ❤️ in Kenya**
