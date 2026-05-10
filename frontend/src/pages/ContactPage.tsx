import React, { useState } from 'react';
import { submitContactApi } from '../api/contactApi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await submitContactApi(form);
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send message');
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
      Contact Us
    </motion.h1>
    <p className="text-white/80 mt-2">We'd love to hear from you</p>
  </div>
</div>

      <div className="max-w-2xl mx-auto py-12 px-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none text-sm focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                value={form.email} onChange={e => set('email', e.target.value)}
                type="email" placeholder="you@email.com"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none text-sm focus:border-primary"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                value={form.phone} onChange={e => set('phone', e.target.value)}
                type="tel" placeholder="9876543210"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none text-sm focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <input
                value={form.subject} onChange={e => set('subject', e.target.value)}
                placeholder="Inquiry about..."
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none text-sm focus:border-primary"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
            <textarea
              value={form.message} onChange={e => set('message', e.target.value)}
              rows={5} placeholder="Your message..."
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none text-sm resize-none focus:border-primary"
              required
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dull transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {/* <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-2">📞</div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-semibold text-gray-800">+91 80 4043 1111</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-2">📧</div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-gray-800">support@realestate.com</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-2">📍</div>
            <p className="text-sm text-gray-500">Office</p>
            <p className="font-semibold text-gray-800">Bengaluru, India</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ContactPage;
