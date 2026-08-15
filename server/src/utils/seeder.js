import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const categoriesData = [
  {
    name: 'Electronics & Audio',
    slug: 'electronics-audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    description: 'High fidelity audio gear, noise cancelling headphones, and modern gadgets.'
  },
  {
    name: 'Smart Watches & Wearables',
    slug: 'smart-watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    description: 'Track fitness, monitor health metrics, and stay connected on the go.'
  },
  {
    name: 'Fashion & Footwear',
    slug: 'fashion-footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    description: 'Premium sneakers, urban outerwear, and timeless style essentials.'
  },
  {
    name: 'Home & Workspace',
    slug: 'home-workspace',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    description: 'Ergonomic accessories, ambient lighting, and sleek desk setups.'
  }
];

const seedDB = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();

    console.log('Creating Admin and Test Users...');
    const adminUser = await User.create({
      name: 'Admin Manager',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });

    const customerUser = await User.create({
      name: 'Alex Johnson',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
      addresses: [
        {
          street: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'OR',
          postalCode: '97477',
          country: 'United States',
          isDefault: true
        }
      ],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    });

    console.log('Creating Categories...');
    const createdCategories = await Category.insertMany(categoriesData);

    const electronicsCat = createdCategories.find(c => c.slug === 'electronics-audio')._id;
    const wearablesCat = createdCategories.find(c => c.slug === 'smart-watches')._id;
    const fashionCat = createdCategories.find(c => c.slug === 'fashion-footwear')._id;
    const homeCat = createdCategories.find(c => c.slug === 'home-workspace')._id;

    console.log('Creating Products...');
    const productsData = [
      {
        name: 'AeroSound Pro Wireless ANC Headphones',
        description: 'Immerse yourself in crystal clear audio with 40mm titanium drivers and active noise cancellation up to -38dB. Built for 40 hours of continuous playback with quick charging.',
        price: 199.99,
        originalPrice: 249.99,
        category: electronicsCat,
        brand: 'AeroSound',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
        ],
        stock: 25,
        rating: 4.8,
        numReviews: 14,
        isFeatured: true,
        specifications: [
          { key: 'Battery Life', value: '40 Hours' },
          { key: 'Connectivity', value: 'Bluetooth 5.3' },
          { key: 'Weight', value: '250g' }
        ]
      },
      {
        name: 'Chronos Ultra Smartwatch Titanium Edition',
        description: 'Featuring an ultra-bright 2000 nits Sapphire AMOLED display, dual-frequency GPS tracking, heart rate variability metrics, and 100m water resistance.',
        price: 299.99,
        originalPrice: 349.99,
        category: wearablesCat,
        brand: 'Chronos',
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
        ],
        stock: 18,
        rating: 4.9,
        numReviews: 28,
        isFeatured: true,
        specifications: [
          { key: 'Display', value: '1.43" AMOLED' },
          { key: 'Water Resistance', value: '10 ATM (100m)' },
          { key: 'Battery', value: 'Up to 14 days' }
        ]
      },
      {
        name: 'Vortex Runner Pro Nitro Sneakers',
        description: 'Engineered for responsive energy return with nitrogen-infused foam midsoles and breathable engineered mesh uppers for peak marathon performance.',
        price: 139.99,
        originalPrice: 169.99,
        category: fashionCat,
        brand: 'Vortex Athletics',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
        ],
        stock: 40,
        rating: 4.7,
        numReviews: 19,
        isFeatured: true,
        specifications: [
          { key: 'Midsole', value: 'Nitro Foam' },
          { key: 'Drop', value: '8mm' },
          { key: 'Upper Material', value: 'FlyMesh Pro' }
        ]
      },
      {
        name: 'Minimalist Walnut Studio Desk Monitor Stand',
        description: 'Handcrafted solid American walnut monitor riser designed to maximize desk space while promoting posture ergonomics with built-in cable management channels.',
        price: 89.99,
        originalPrice: 109.99,
        category: homeCat,
        brand: 'Craft & Wood',
        images: [
          'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
        ],
        stock: 15,
        rating: 4.9,
        numReviews: 9,
        isFeatured: true,
        specifications: [
          { key: 'Material', value: 'Solid American Walnut' },
          { key: 'Max Load', value: '50 lbs (22.6kg)' },
          { key: 'Dimensions', value: '42" x 9" x 4.2"' }
        ]
      },
      {
        name: 'Lumina RGB Dynamic Ambiance Light Bar',
        description: 'Smart ambient light bar with 16 million colors, reactive sound sync, dynamic scene modes, and wireless smart home integration (Alexa / Google Home / Apple HomeKit).',
        price: 64.99,
        originalPrice: 79.99,
        category: homeCat,
        brand: 'LuminaTech',
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
        ],
        stock: 32,
        rating: 4.6,
        numReviews: 22,
        isFeatured: false,
        specifications: [
          { key: 'Colors', value: '16M RGBIC' },
          { key: 'Connectivity', value: 'Wi-Fi 2.4GHz + Bluetooth' }
        ]
      },
      {
        name: 'Urban Leather Messenger Bag & Laptop Sleeve',
        description: 'Full-grain vintage Italian leather messenger bag featuring padded 16-inch laptop compartment, antique brass hardware, and weather-resistant lining.',
        price: 159.99,
        originalPrice: 199.99,
        category: fashionCat,
        brand: 'Heritage Leather',
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
        ],
        stock: 12,
        rating: 4.8,
        numReviews: 16,
        isFeatured: true,
        specifications: [
          { key: 'Material', value: 'Full-Grain Italian Leather' },
          { key: 'Fit', value: 'Up to 16" Laptops' }
        ]
      },
      {
        name: 'SonicBeat Portable Waterproof Bluetooth Speaker',
        description: '360-degree room-filling audio with dual passive radiators, IP67 dust/waterproof rating, and 24-hour party battery life.',
        price: 79.99,
        originalPrice: 99.99,
        category: electronicsCat,
        brand: 'SonicBeat',
        images: [
          'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
        ],
        stock: 50,
        rating: 4.5,
        numReviews: 35,
        isFeatured: false,
        specifications: [
          { key: 'Output Power', value: '30W RMS' },
          { key: 'Waterproof Rating', value: 'IP67' }
        ]
      }
    ];

    const createdProducts = await Product.insertMany(productsData);

    console.log('Creating Initial Sample Coupons...');
    await Coupon.create([
      {
        code: 'WELCOME10',
        discountPercent: 10,
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        isActive: true
      },
      {
        code: 'SUMMER20',
        discountPercent: 20,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        isActive: true
      }
    ]);

    console.log('Creating Sample Order...');
    const firstProduct = createdProducts[0];
    await Order.create({
      user: customerUser._id,
      orderItems: [
        {
          product: firstProduct._id,
          name: firstProduct.name,
          quantity: 1,
          price: firstProduct.price,
          image: firstProduct.images[0]
        }
      ],
      shippingAddress: customerUser.addresses[0],
      paymentMethod: 'Stripe',
      paymentResult: {
        id: 'pi_simulated_seed_payment',
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: customerUser.email
      },
      itemsPrice: firstProduct.price,
      shippingPrice: 0,
      taxPrice: Math.round(firstProduct.price * 0.08 * 100) / 100,
      totalAmount: Math.round((firstProduct.price * 1.08) * 100) / 100,
      isPaid: true,
      paidAt: new Date(),
      isDelivered: false,
      orderStatus: 'Processing'
    });

    console.log('✅ Database Seeded Successfully!');
    console.log('------------------------------------');
    console.log('Admin Account:    admin@example.com / password123');
    console.log('Customer Account: user@example.com  / password123');
    console.log('------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error(`Error Seeding Database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
