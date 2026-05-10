import React, { useState } from 'react';
import { submitFeedbackApi } from '../api/feedbackApi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const FeedbackPage = () => {
  const [form, setForm] = useState({ name: '', email: '', rating: 5, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await submitFeedbackApi(form);
      toast.success('Thank you for your feedback!');
      setForm({ name: '', email: '', rating: 5, message: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
             <div className="relative w-full h-[10vh] min-h-[250px]">
           <img src="/images/panoramic.jpg" alt="Background Image" className="object-cover object-center w-full h-full" />
      
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
          >
            Feedback Form
          </motion.h1>
          <p className="text-white/80 mt-2">Help us improve your experience</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto py-12 px-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none text-sm focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              type="email" placeholder="you@email.com"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none text-sm focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, rating: star }))}
                  className={`text-3xl transition cursor-pointer ${star <= form.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500 self-center">{form.rating}/5</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Feedback *</label>
            <textarea
              value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              rows={5} placeholder="Tell us what you think..."
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none text-sm resize-none focus:border-primary"
              required
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dull transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
