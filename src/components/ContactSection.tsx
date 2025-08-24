import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function ContactSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 bg-[#0A0A0A] relative overflow-hidden" id="contact">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="text-sm font-medium text-white/60 tracking-wider uppercase">
            Qualification Required
          </span>
          <h2 className="mt-4 text-5xl md:text-6xl font-light text-white tracking-tighter">
            Not for everyone.<br />
            <span className="font-medium">Ready to qualify?</span>
          </h2>
          <div className="mt-8 space-y-4 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <p className="text-white/80 leading-relaxed">
                <strong>Waitlist Requirements:</strong><br />
                • Wallet address with 5+ Solana transactions<br />
                • Participation in 1+ IDO/launch (Pump.fun, Tensor)<br />
                • Or GitHub repo with Solana/Anchor code
              </p>
            </div>
            <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-6">
              <p className="text-red-300/90 leading-relaxed">
                <strong>Access Tiers:</strong><br />
                Tier 1 (Agent Factory): Open after qualification<br />
                Tier 2 (Agent Studio): Invite-only, requires 20% PnL in sandbox<br />
                Tier 3 (Agent Cloud): Reserved for top 0.1% of builders
              </p>
            </div>
            <p className="text-white/40 text-sm text-center mt-6">
              This isn&apos;t access control. It&apos;s performance-based permissioning.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}