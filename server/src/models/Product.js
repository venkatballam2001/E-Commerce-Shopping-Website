import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    originalPrice: { type: Number, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, default: 'Generic' },
    images: [{ type: String, required: true }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },
    specifications: [{ key: String, value: String }]
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
