import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function WorkSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 bg-[#0A0A0A] relative overflow-hidden" id="work">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="text-sm font-medium text-white/60 tracking-wider uppercase">
            The Product is the Proof
          </span>
          <h2 className="mt-4 text-5xl md:text-6xl font-light text-white tracking-tighter">
            No Screenshots. No Promises.<br />
            <span className="font-medium">Only Performance.</span>
          </h2>
          <p className="mt-6 text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
            On-chain verified PnL. Real agents running. Actual transactions, not backtests.<br />
            Performance becomes product.
          </p>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">847%</div>
              <div className="text-white/60 text-sm uppercase tracking-wider">Average Agent ROI</div>
              <div className="text-white/40 text-xs mt-2">On-chain verified, 30d rolling</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">&lt;380ms</div>
              <div className="text-white/60 text-sm uppercase tracking-wider">Avg. Execution Speed</div>
              <div className="text-white/40 text-xs mt-2">Detection to transaction</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">2,847</div>
              <div className="text-white/60 text-sm uppercase tracking-wider">Active Agents</div>
              <div className="text-white/40 text-xs mt-2">Live on Solana mainnet</div>
            </div>
          </div>
          
          <div className="mt-8 bg-yellow-900/20 border border-yellow-500/20 rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-yellow-300/90 text-center leading-relaxed">
              <strong>Weekly PnL Reports:</strong> Published every Monday with full on-chain transaction logs.<br />
              No marketing metrics. No cherry-picked timeframes. Just math.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}