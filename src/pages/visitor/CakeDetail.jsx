import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  fetchCakeById, fetchCakeReviews, createReview, fetchCustomerOrders 
} from '../../firebase/services';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import RatingStars from '../../components/common/RatingStars';
import CustomizationModal from '../../components/cake/CustomizationModal';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  ShoppingBag, Sparkles, Clock, Scale, ShieldCheck, Heart, 
  MessageSquare, Star, ArrowLeft, CheckCircle2, AlertCircle 
} from 'lucide-react';

export default function CakeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useNotification();

  const [cake, setCake] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isEligibleToReview, setIsEligibleToReview] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadCakeData() {
      setLoading(true);
      try {
        const cakeData = await fetchCakeById(id);
        if (cakeData) {
          setCake(cakeData);
          setSelectedImage(cakeData.images?.[0] || cakeData.thumbnail);
          const revs = await fetchCakeReviews(id);
          setReviews(revs);

          // Check if current logged in user has delivered order containing this cake
          if (currentUser?.uid) {
            const userOrders = await fetchCustomerOrders(currentUser.uid);
            const hasCompletedOrder = userOrders.some(o => 
              (o.orderStatus === 'Delivered' || o.orderStatus === 'Completed') &&
              o.items?.some(i => i.id === id)
            );
            setIsEligibleToReview(hasCompletedOrder);
          }
        }
      } catch (err) {
        console.error('Cake detail fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCakeData();
  }, [id, currentUser]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse space-y-4">
        <div className="h-8 bg-rose-100 rounded w-1/3 mx-auto" />
        <div className="h-96 bg-rose-100 rounded-3xl w-full max-w-2xl mx-auto" />
      </div>
    );
  }

  if (!cake) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="font-serif-title font-bold text-2xl text-gray-900">Cake Not Found</h2>
        <p className="text-xs text-gray-500">The cake you are looking for does not exist or was unlisted.</p>
        <Link to="/cakes" className="inline-block px-6 py-2.5 bg-rose-600 text-white rounded-full font-bold text-xs">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const price = cake.price;
  const discountPrice = cake.discountPrice;
  const isDiscounted = discountPrice && discountPrice < price;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingReview(true);

    try {
      const revObj = await createReview({
        cakeId: cake.id,
        customerId: currentUser.uid,
        customerName: userProfile?.displayName || 'Verified Customer',
        rating: newRating,
        comment: newComment.trim(),
        verifiedPurchase: true
      });
      setReviews([revObj, ...reviews]);
      setNewComment('');
      showToast('Thank you! Your verified review was published.', 'success', 'Review Added');
    } catch (err) {
      showToast('Could not post review. Try again.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Back link */}
      <Link to="/cakes" className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700">
        <ArrowLeft className="w-4 h-4" /> Back to Cake Catalog
      </Link>

      {/* Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Gallery Column */}
        <div className="space-y-4">
          <div className="glass-card rounded-3xl overflow-hidden border border-rose-200 shadow-xl">
            <ImageWithFallback
              src={selectedImage || cake.thumbnail}
              alt={cake.name}
              aspectRatio="aspect-square"
            />
          </div>

          {/* Thumbnails */}
          {cake.images && cake.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {cake.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition ${
                    selectedImage === img ? 'border-rose-600 ring-2 ring-rose-200' : 'border-rose-100 opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Column */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-1">
              {cake.categoryName || 'Artisan Speciality'}
            </span>
            <h1 className="font-serif-title font-bold text-3xl sm:text-4xl text-gray-900 leading-tight">
              {cake.name}
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <RatingStars rating={cake.rating || 5} size="md" />
              <span className="text-xs font-semibold text-gray-600">
                {cake.rating || 5.0} ({reviews.length} Verified Reviews)
              </span>
            </div>
          </div>

          {/* Price & Discount */}
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-100 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-rose-600">
              ${(isDiscounted ? discountPrice : price).toFixed(2)}
            </span>
            {isDiscounted && (
              <span className="text-base text-gray-400 line-through">
                ${price.toFixed(2)}
              </span>
            )}
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full ml-auto">
              In Stock & Ready for Delivery
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {cake.description}
          </p>

          {/* Specifications Table */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-rose-100 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" />
              <div>
                <span className="text-gray-400 block">Prep Time</span>
                <strong className="text-gray-900">{cake.preparationTime || '24 Hours'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-rose-500" />
              <div>
                <span className="text-gray-400 block">Weight & Size</span>
                <strong className="text-gray-900">{cake.weight || '1.5 kg'} ({cake.size || '8 inches'})</strong>
              </div>
            </div>
          </div>

          {/* Ingredients list */}
          {cake.ingredients && (
            <div className="text-xs">
              <span className="font-bold text-gray-900 block mb-1">Premium Ingredients:</span>
              <p className="text-gray-600 italic">{cake.ingredients}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setIsCustomizing(true)}
              className="flex-1 py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-200 hover:from-rose-600 hover:to-pink-700 transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Customize & Order Now</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-gray-500 pt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Doorstep Cold Delivery
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-rose-500" /> Fresh Daily Guarantee
            </span>
          </div>

        </div>

      </div>

      {/* REVIEWS & VERIFIED PURCHASES SECTION */}
      <section className="pt-10 border-t border-rose-100 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif-title font-bold text-2xl text-gray-900">
              Verified Guest Reviews ({reviews.length})
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Reviews can only be submitted by verified purchasers with completed orders.
            </p>
          </div>

          {!currentUser && (
            <span className="text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full font-medium">
              Log in to post a verified review
            </span>
          )}
        </div>

        {/* Write Review Form for Eligible Customers */}
        {currentUser && isEligibleToReview && (
          <form onSubmit={handleReviewSubmit} className="glass-card rounded-3xl p-6 border border-rose-200 space-y-4">
            <h3 className="font-serif-title font-bold text-sm text-gray-900">Leave Your Verified Review</h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Your Rating</label>
              <RatingStars rating={newRating} interactive onChange={setNewRating} size="md" />
            </div>
            <div>
              <textarea
                required
                rows={3}
                placeholder="Share how the cake tasted, frosting texture, and delivery experience..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-white border border-rose-200 rounded-xl p-3 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-2.5 rounded-full bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition"
            >
              {submittingReview ? 'Submitting...' : 'Post Verified Review'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No reviews yet for this cake. Be the first to try it!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="glass-card rounded-2xl p-5 border border-rose-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900">{rev.customerName}</span>
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <RatingStars rating={rev.rating} size="sm" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                <span className="text-[10px] text-gray-400 block">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Customization Modal */}
      {isCustomizing && (
        <CustomizationModal
          cake={cake}
          isOpen={isCustomizing}
          onClose={() => setIsCustomizing(false)}
        />
      )}

    </div>
  );
}
