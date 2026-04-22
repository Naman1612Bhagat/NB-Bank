import React, { useState } from 'react';
import axios from 'axios';
import { Send, MessageSquare, CheckCircle } from 'lucide-react';

const Feedback = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/feedback', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">We Value Your Feedback</h1>
          <p className="text-lg text-gray-600">Have a question, suggestion, or issue? Let us know how we can improve your banking experience.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3">
            
            {/* Contact Info Sidebar */}
            <div className="bg-[var(--primary-color)] text-white p-8 md:col-span-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><MessageSquare /> Get in Touch</h3>
                <p className="text-blue-100 mb-8 text-sm leading-relaxed">
                  Fill out the form and our team will get back to you within 24 hours. Your feedback drives our innovation.
                </p>
              </div>
              <div className="space-y-4 text-sm text-blue-100">
                <p><strong>Support:</strong><br/>support@nbbank.com</p>
                <p><strong>Phone:</strong><br/>+1 (800) 123-4567</p>
              </div>
            </div>

            {/* Feedback Form */}
            <div className="p-8 md:col-span-2">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <CheckCircle className="text-green-500 w-16 h-16" />
                  <h3 className="text-2xl font-bold text-gray-900">Thank You!</h3>
                  <p className="text-gray-600">Your feedback has been successfully submitted. We appreciate your input!</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-[var(--primary-color)] font-medium hover:underline"
                  >
                    Submit another response
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        required
                        value={formData.name} 
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        name="email" 
                        required
                        value={formData.email} 
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input 
                      type="text" 
                      name="subject" 
                      required
                      value={formData.subject} 
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea 
                      name="message" 
                      required
                      rows="4"
                      value={formData.message} 
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium transition-all shadow-md ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-[var(--primary-color)] hover:bg-[var(--secondary-color)]'}`}
                  >
                    {loading ? 'Sending...' : <><Send size={18} /> Send Feedback</>}
                  </button>
                </form>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
