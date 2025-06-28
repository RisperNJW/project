// MongoDB initialization script
db = db.getSiblingDB('go2bookings');

// Create collections
db.createCollection('users');
db.createCollection('services');
db.createCollection('bookings');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActive: 1 });

db.services.createIndex({ category: 1, status: 1 });
db.services.createIndex({ 'location.coordinates': '2dsphere' });
db.services.createIndex({ 'rating.average': -1 });
db.services.createIndex({ featured: -1, createdAt: -1 });
db.services.createIndex({ provider: 1 });

db.bookings.createIndex({ user: 1, createdAt: -1 });
db.bookings.createIndex({ provider: 1, status: 1 });
db.bookings.createIndex({ bookingId: 1 }, { unique: true });
db.bookings.createIndex({ 'bookingDetails.startDate': 1 });

// Insert sample data
db.users.insertOne({
  name: 'Admin User',
  email: 'admin@kenyatourism.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq/3/Hm', // password123
  role: 'admin',
  isVerified: true,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

console.log('Database initialized successfully');