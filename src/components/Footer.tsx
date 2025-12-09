import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative bg-gray-50 dark:bg-[#0A0A0A] border-t border-black/10 dark:border-white/10 transition-colors duration-500">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-8"
        >
          {/* Logo & Tagline */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-medium text-black dark:text-white mb-4">c0gni</h3>
            <p className="text-black/60 dark:text-white/60 max-w-md leading-relaxed">
              AI-powered multi-chain trading agents. Execute on low-gas chains,
              build wealth on Ethereum&apos;s DeFi ecosystem.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-black dark:text-white font-medium mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
                  Request Access
                </a>
              </li>
              <li>
                <a href="#" className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
                  Performance
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-black dark:text-white font-medium mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-black/40 dark:text-white/40 text-sm">
            © {new Date().getFullYear()} c0gni. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}