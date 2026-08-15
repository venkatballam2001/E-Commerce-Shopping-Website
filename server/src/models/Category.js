import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Category name is required'], unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String, required: true },
    description: { type: String, trim: true }
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);
export default Category;
