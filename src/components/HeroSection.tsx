"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LightRays } from "./LazyComponents";
import PressButton from "./ui/PressButton";

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
      className="relative min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A] overflow-hidden transition-colors duration-500"
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
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-white/5 dark:to-gray-300/5 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-l from-indigo-500/10 to-blue-500/10 dark:from-gray-400/5 dark:to-white/5 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-gradient-to-t from-purple-500/10 to-indigo-500/10 dark:from-gray-300/5 dark:to-white/5 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-black dark:text-white leading-tight tracking-tighter mb-6 sm:mb-8 px-4"
          >
            Trade fast on any chain
            <br />
            <span className="font-medium">Build wealth on Ethereum.</span>
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
            className="text-lg sm:text-xl text-black/70 dark:text-white/70 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4"
          >
            AI agents execute on Polygon, Arbitrum, Base for &lt;$0.01 fees.<br />
            Rotate profits into Ethereum blue-chips and yield pools for stable income.
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
            <PressButton
              label="Request Access"
              icon={<ArrowRight className="w-4 h-4" />}
              className="min-w-[180px]"
            />
            
            <PressButton
              label="View Performance"
              className="min-w-[180px]"
              buttonGradient={{
                start: "rgba(40, 40, 40, 1)",
                end: "rgba(20, 20, 20, 1)"
              }}
              labelGradient={{
                start: "rgba(255, 255, 255, 1)",
                end: "rgba(200, 200, 200, 1)"
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}