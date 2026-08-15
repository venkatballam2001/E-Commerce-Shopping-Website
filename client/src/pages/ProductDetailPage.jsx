import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductById,
  fetchProductReviews,
  createReview,
} from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import Rating from '../components/Rating';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Minus,
  MessageSquare
} from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { productDetail, detailLoading, reviews, reviewsLoading } = useSelector(
    (state) => state.product
  );
  const { userInfo } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchProductReviews(id));
  }, [dispatch, id]);

  if (detailLoading || !productDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-xs font-bold text-slate-500">Loading product details...</p>
      </div>
    );
  }

  const isWishlisted = wishlistItems.some((item) => item._id === productDetail._id);
  const discountPercent = productDetail.originalPrice && productDetail.originalPrice > productDetail.price
    ? Math.round(((productDetail.originalPrice - productDetail.price) / productDetail.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product: productDetail._id,
        name: productDetail.name,
        image: productDetail.images[0],
        price: productDetail.price,
        stock: productDetail.stock,
        quantity,
      })
    );
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!commentInput.trim()) {
      setReviewError('Please enter a review comment');
      return;
    }
    const resultAction = await dispatch(
      createReview({ productId: id, rating: ratingInput, comment: commentInput })
    );
    if (createReview.fulfilled.match(resultAction)) {
      setCommentInput('');
      setRatingInput(5);
    } else {
      setReviewError(resultAction.payload || 'Failed to submit review');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Product Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
            <img
              src={productDetail.images[selectedImageIndex] || productDetail.images[0]}
              alt={productDetail.name}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {productDetail.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {productDetail.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full uppercase tracking-wider">
                {productDetail.brand || 'Brand Original'}
              </span>
              <Rating value={productDetail.rating} numReviews={productDetail.numReviews} size="md" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {productDetail.name}
            </h1>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-black text-slate-900">
              ${productDetail.price.toFixed(2)}
            </span>
            {productDetail.originalPrice > productDetail.price && (
              <span className="text-lg text-slate-400 line-through">
                ${productDetail.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-slate-600 text-sm leading-relaxed border-t border-b border-slate-100 py-4">
            {productDetail.description}
          </p>

          {/* Specifications list */}
          {productDetail.specifications && productDetail.specifications.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Specifications</h4>
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {productDetail.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between border-b border-slate-200/50 pb-1">
                    <span className="text-slate-500 font-medium">{spec.key}:</span>
                    <span className="font-bold text-slate-800">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stock & Quantity Control */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-500">Stock Status:</span>
              {productDetail.stock > 0 ? (
                <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  In Stock ({productDetail.stock} available)
                </span>
              ) : (
                <span className="inline-flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  Out of Stock
                </span>
              )}
            </div>

            {productDetail.stock > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-slate-500">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-extrabold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(productDetail.stock, quantity + 1))}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA buttons */}
          <div className="flex items-center space-x-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={productDetail.stock <= 0}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add {quantity} to Cart</span>
            </button>

            <button
              onClick={() => dispatch(toggleWishlist(productDetail))}
              className={`p-4 rounded-2xl border transition-all ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-center text-[11px] font-semibold text-slate-500">
            <div className="p-3 bg-slate-50 rounded-xl">
              <Truck className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
              Free Dispatch
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
              2-Year Warranty
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <RotateCcw className="w-4 h-4 mx-auto mb-1 text-amber-600" />
              30-Day Return
            </div>
          </div>

        </div>

      </div>

      {/* Reviews & Ratings Section */}
      <section className="pt-10 border-t border-slate-200 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Customer Verified Reviews</h2>
            <p className="text-xs text-slate-500">Genuine feedback from verified buyers</p>
          </div>
          <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-bold">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{productDetail.rating.toFixed(1)} / 5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Review List */}
          <div className="lg:col-span-2 space-y-4">
            {reviewsLoading ? (
              <p className="text-xs text-slate-400">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-8 text-center text-xs text-slate-500">
                No reviews yet. Be the first to share feedback for this item!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{rev.name}</h4>
                        {rev.isVerifiedPurchase && (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" /> Verified Buyer
                          </span>
                        )}
                      </div>
                    </div>
                    <Rating value={rev.rating} />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{rev.comment}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Add Review Form */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 h-fit">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Write a Product Review</h3>
            </div>

            {userInfo ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-semibold">
                    {reviewError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Rating</label>
                  <select
                    value={ratingInput}
                    onChange={(e) => setRatingInput(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Poor</option>
                    <option value={1}>1 Star - Terrible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Your Review</label>
                  <textarea
                    rows={4}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Describe product quality, design, and performance..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-colors"
                >
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-slate-500">Please sign in to write a review.</p>
                <Link
                  to="/login"
                  className="inline-block bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>

        </div>

      </section>

    </div>
  );
};

export default ProductDetailPage;
