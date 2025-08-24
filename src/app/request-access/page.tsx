'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function RequestAccessPage() {
  const [email, setEmail] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Wireframe - would handle actual submission here
    setIsSubmitted(true);
  };

  const handleWalletConnect = () => {
    // Wireframe - would handle actual wallet connection here
    setWalletConnected(!walletConnected);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
        >
          <div className="mb-6">
            <div className="flex items-center justify-center mx-auto mb-6">
              <Image src="/c0gni-white.svg" alt="C0gni Labs" width={120} height={40} className="h-10" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">You&apos;re on the list!</h1>
            <p className="text-white/70">
              Thanks for requesting access. We&apos;ll notify you when it&apos;s your turn.
            </p>
          </div>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all duration-200"
          >
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-4"
          >
            <div className="flex items-center justify-center mx-auto mb-6">
              <Image src="/c0gni-white.svg" alt="C0gni Labs" width={150} height={50} className="h-12" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Request Access</h1>
            <p className="text-white/70">
              Join the waitlist to get early access to our AI-powered trading platform
            </p>
          </motion.div>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Wallet Connection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Solana Wallet
              </label>
              <button
                type="button"
                onClick={handleWalletConnect}
                className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl font-medium transition-all duration-200 ${
                  walletConnected
                    ? 'bg-white/15 border-white/30 text-white'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5" />
                  <span>
                    {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
                  </span>
                </div>
                {walletConnected && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </button>
              {walletConnected && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-sm text-white/70 mt-2"
                >
                  • Connected: 7xK2...9mN4 (Phantom)
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!email || !walletConnected}
              whileHover={email && walletConnected ? { scale: 1.02 } : {}}
              whileTap={email && walletConnected ? { scale: 0.98 } : {}}
              className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                email && walletConnected
                  ? 'bg-white text-black hover:shadow-2xl hover:shadow-white/10'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              Join Waitlist
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}