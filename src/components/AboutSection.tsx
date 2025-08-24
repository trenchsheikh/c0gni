import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { cn } from "@/lib/utils";

export default function AboutSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 md:py-32 bg-[#0A0A0A] relative overflow-hidden" id="about">
      {/* Interactive Grid Pattern Background */}
      <div className="absolute inset-0 flex items-center justify-end pr-8 sm:pr-16 md:pr-32">
        <InteractiveGridPattern
          className={cn(
            "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] sm:[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            "skew-y-6 opacity-20 sm:opacity-30",
          )}
          squares={[20, 20]}
          squaresClassName="stroke-white/20 hover:fill-white/10"
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="text-sm font-medium text-white/60 tracking-wider uppercase">
            Solana as the AI Execution Layer
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tighter px-4">
            Ethereum is for settlement.<br />
            <span className="font-medium">Solana is for action.</span>
          </h2>
          <p className="mt-6 text-base sm:text-lg text-white/60 max-w-3xl mx-auto leading-relaxed px-4">
            400ms blocks = AI reaction speed. Sub-cent fees = high-frequency experimentation.<br />
            Jito = priority execution. Helius = real-time event stream.<br />
            <br />
            c0gni isn&apos;t on Solana. It&apos;s optimized for Solana&apos;s physics.<br />
            The platform gets smarter as it scales.
          </p>
        </motion.div>
      </div>
    </section>
  );
}