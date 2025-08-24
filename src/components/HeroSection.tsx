import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import LightRays from "./LightRays";

export default function HeroSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <motion.section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-[#0A0A0A] overflow-hidden"
      style={{ y, opacity }}
      id="hero"
    >
      {/* Light rays effect */}
      <div className="absolute inset-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
        />
      </div>

      {/* Animated background orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-white/5 to-gray-300/5 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-l from-gray-400/5 to-white/5 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-gradient-to-t from-gray-300/5 to-white/5 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
        >
          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { 
                  duration: 0.8, 
                  ease: [0.16, 1, 0.3, 1] 
                } 
              }
            }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-tight tracking-tighter mb-6 sm:mb-8 px-4"
          >
            Your last trade
            <br />
            <span className="font-medium">was too slow.</span>
          </motion.h1>

          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { 
                  duration: 0.8, 
                  ease: [0.16, 1, 0.3, 1] 
                } 
              }
            }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4"
          >
            Stop building bots that react. Start deploying agents that decide.<br />
            The best alpha is captured in &lt;1 second. Humans can&apos;t move that fast.
          </motion.p>

          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { 
                  duration: 0.8, 
                  ease: [0.16, 1, 0.3, 1] 
                } 
              }
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center px-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-xl font-medium transition-all duration-300 hover:shadow-2xl hover:shadow-white/10 min-h-[44px] text-sm sm:text-base"
            >
              Request Access
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/5 backdrop-blur-sm text-white border border-white/10 rounded-xl font-medium transition-all duration-300 hover:bg-white/10 hover:border-white/20 min-h-[44px] text-sm sm:text-base"
            >
              View Performance
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}