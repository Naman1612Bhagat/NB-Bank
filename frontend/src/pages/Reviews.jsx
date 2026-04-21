import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({ name: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/reviews');
      setReviews(response.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (newRating) => {
    setFormData({ ...formData, rating: newRating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/reviews', formData);
      setSubmitted(true);
      setFormData({ name: '', rating: 5, comment: '' });
      // Refresh the reviews list
      fetchReviews();
      
      // Hide success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Submit a Review */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 sticky top-28">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageCircle className="text-[var(--primary-color)]" />
              Write a Review
            </h2>
            
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Thank You!</h3>
                <p className="text-gray-600 mt-2">Your review has been published.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required
                    value={formData.name} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-all"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="focus:outline-none transform hover:scale-110 transition-transform"
                      >
                        <Star 
                          size={28} 
                          fill={star <= formData.rating ? "#FBBF24" : "none"} 
                          color={star <= formData.rating ? "#FBBF24" : "#D1D5DB"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review Comment</label>
                  <textarea 
                    name="comment" 
                    required
                    rows="4"
                    value={formData.comment} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-all resize-none"
                    placeholder="Share your experience with NB Bank..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all shadow-md ${submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-[var(--primary-color)] hover:bg-[var(--secondary-color)]'}`}
                >
                  {submitting ? 'Publishing...' : 'Publish Review'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: List of Reviews */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Customer Reviews</h1>
            <p className="text-lg text-gray-600">See what our community is saying about NB Bank.</p>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-xl flex items-center gap-3 text-red-700 mb-8 border border-red-100">
              <AlertCircle size={24} />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="w-full space-y-3 pt-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-[var(--primary-color)] text-xl uppercase">
                        {review.NAME.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 capitalize text-lg">{review.NAME}</h4>
                        <p className="text-xs text-gray-500">
                          {new Date(review.CREATED_AT).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          fill={i < review.RATING ? "currentColor" : "none"} 
                          color={i < review.RATING ? "currentColor" : "#D1D5DB"} 
                          size={18} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed pl-16">
                    "{review.COMMENT_TEXT}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <Star className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-500">Be the first to share your experience with NB Bank!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Reviews;
