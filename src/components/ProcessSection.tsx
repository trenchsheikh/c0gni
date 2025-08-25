import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const processSteps = [
  {
    number: "01",
    title: "Deploy Across Multiple Chains",
    description: "Select EVM-compatible agent blueprints (Cross-Chain Arbitrage, Yield Optimizer, DeFi Farmer). Connect MetaMask. Fund with ETH/MATIC/ARB. Deploy simultaneously on multiple chains."
  },
  {
    number: "02",
    title: "Execute on Low-Gas Chains",
    description: "<$0.01 transaction fees on Polygon, Arbitrum, Base. Flashbots MEV protection. Real-time indexing via The Graph. Trade at scale without gas drain."
  },
  {
    number: "03",
    title: "Rotate Profits to Ethereum",
    description: "Automatic bridging to Ethereum mainnet. Deploy into blue-chip DeFi: Aave, Compound, Curve. Convert volatile gains into stable yield-bearing positions."
  },
  {
    number: "04",
    title: "Compound & Build Wealth",
    description: "Multi-chain coordination for maximum yield. Fast trades on L2s → Stable yields on Ethereum. Reinvest earnings automatically. Long-term wealth accumulation strategy."
  }
];

export default function ProcessSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  return (
    <section ref={sectionRef} className="py-16 sm:py-24 md:py-32 bg-[#111111]" id="process">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="text-sm font-medium text-white/60 tracking-wider uppercase">The End of Human Latency</span>
          <h2 className="mt-4 text-5xl md:text-6xl font-light text-white tracking-tighter">
            From Zero to <span className="font-medium">Autonomy</span>
          </h2>
          <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            You&apos;re not slow. You&apos;re human. And that&apos;s the problem.<br />
            Agents never sleep, never hesitate, always learn.
          </p>
        </motion.div>

        <motion.div 
          className="relative max-w-3xl mx-auto"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
        >
          <motion.div 
            initial={{ height: 0 }}
            animate={isInView ? { height: "100%" } : {}}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-5 sm:left-6 top-0 bottom-0 w-px bg-white/20"
          />
          
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { 
                    duration: 0.8, 
                    ease: [0.16, 1, 0.3, 1] 
                  }
                }
              }}
              className="relative flex items-start gap-4 sm:gap-8 pl-12 sm:pl-16 pb-12 sm:pb-16 last:pb-0"
            >
              <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#0A0A0A] border-2 border-white/20 rounded-full">
                <span className="text-white font-medium text-xs sm:text-sm">{step.number}</span>
              </div>
              <div className="pt-2">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}