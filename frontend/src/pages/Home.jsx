import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, Lock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reviews, setReviews] = useState([]);

  const slides = [
    {
      image: '/assets/secure_banking.png',
      title: 'Secure Banking with NB Bank',
      subtitle: 'Your wealth, guarded by state-of-the-art security.'
    },
    {
      image: '/assets/fast_transactions.png',
      title: 'Fast Transactions, Trusted Service',
      subtitle: 'Experience lightning-fast transfers anywhere, anytime.'
    },
    {
      image: '/assets/open_account.png',
      title: 'Open Your Account in Minutes',
      subtitle: 'Seamless digital onboarding from the comfort of your home.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reviews/latest');
        setReviews(response.data);
      } catch (err) {
        console.error("Failed to fetch latest reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section 1: Slider Ads */}
      <section className="relative w-full h-[60vh] bg-gray-900 overflow-hidden" style={{ backgroundImage: "url('/assets/hero_background.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* We optionally blend the slide image over the hero background */}
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover mix-blend-overlay opacity-80" />
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 shadow-lg animate-slide-up">{slide.title}</h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl animate-slide-up delay-100 font-light">{slide.subtitle}</p>
              <div className="animate-slide-up delay-200 animate-float mt-4">
                <Link to="/signup" className="bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 px-8 py-4 rounded-full text-lg font-bold hover:from-yellow-300 hover:to-amber-400 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
                  Get Started Today
                </Link>
              </div>
            </div>
          </div>
        ))}
        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-[var(--accent-color)] w-8' : 'bg-white bg-opacity-50 hover:bg-opacity-75'}`}
            />
          ))}
        </div>
      </section>

      {/* Hero Section 2: RBI Guidelines */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Important RBI Guidelines</h2>
            <p className="mt-4 text-lg text-gray-600">Please adhere to these guidelines for a safe banking experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-2xl p-8 shadow-sm border border-blue-100 flex flex-col items-center text-center transform hover:-translate-y-1 transition-all duration-300">
              <div className="bg-blue-100 p-4 rounded-full mb-6">
                <ShieldCheck className="w-10 h-10 text-[var(--primary-color)]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">KYC Mandatory</h3>
              <p className="text-gray-600">Keep your Know Your Customer (KYC) details updated to avoid account freezing.</p>
            </div>
            
            <div className="bg-red-50 rounded-2xl p-8 shadow-sm border border-red-100 flex flex-col items-center text-center transform hover:-translate-y-1 transition-all duration-300">
              <div className="bg-red-100 p-4 rounded-full mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Never Share OTP</h3>
              <p className="text-gray-600">NB Bank or its employees will never ask for your PIN, OTP, or passwords.</p>
            </div>

            <div className="bg-green-50 rounded-2xl p-8 shadow-sm border border-green-100 flex flex-col items-center text-center transform hover:-translate-y-1 transition-all duration-300">
              <div className="bg-green-100 p-4 rounded-full mb-6">
                <Lock className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Transactions</h3>
              <p className="text-gray-600">Always use secure networks for online banking. Avoid public Wi-Fi for transactions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section 3: Happy Customers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="mt-4 text-lg text-gray-600">Real feedback from our valued NB Bank community.</p>
          </div>
          
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 relative hover:shadow-lg transition-shadow">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        fill={i < review.rating ? "currentColor" : "none"} 
                        color={i < review.rating ? "currentColor" : "#D1D5DB"} 
                        size={20} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6 line-clamp-4">"{review.comment_text}"</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-[var(--primary-color)] text-xl uppercase">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 capitalize">{review.name}</h4>
                      <p className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>No reviews available yet. Be the first to share your experience!</p>
              <Link to="/reviews" className="text-[var(--primary-color)] hover:underline mt-4 inline-block font-medium">Leave a Review</Link>
            </div>
          )}
          
        </div>
      </section>

    </div>
  );
};

export default Home;
