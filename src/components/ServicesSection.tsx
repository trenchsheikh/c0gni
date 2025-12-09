import React, { useRef, forwardRef } from "react";
import { motion, useInView } from "framer-motion";
import { BrainCircuit, Bot, Code, BarChartBig, Eye, Layers, LucideIcon } from "lucide-react";
import { Globe } from "@/components/LazyComponents";
import { AnimatedBeam } from "@/components/LazyComponents";
import { cn } from "@/lib/utils";

interface ServiceType {
  icon: LucideIcon;
  title: string;
  description: string;
}

const services = [
  { icon: Bot, title: "Agent Factory", description: "Zero to Autonomy in <60 Seconds. Deploy EVM-compatible agents across Polygon, Arbitrum, Base. Smart contract wallets with cross-chain capabilities. Agents execute on low-gas chains, settle on Ethereum." },
  { icon: Code, title: "Agent Studio", description: "Code-First SDK for Elite Builders. Web3.js/Ethers.js SDK with Hardhat simulation, cross-chain routing, and yield optimization strategies. Build agents that farm, lend, and compound across DeFi." },
  { icon: Layers, title: "Agent Cloud", description: "Multi-Chain Orchestration Layer. Agents coordinate across Ethereum L2s, find arbitrage between chains, and rotate profits into stable yield pools. This is institutional-grade DeFi automation." },
  { icon: BarChartBig, title: "Agent Marketplace", description: "Cross-Chain Strategy Engine. Deploy proven strategies across any EVM chain. Verified on-chain PnL from Ethereum, Polygon, Arbitrum. Real yields, real returns, real wealth building." },
  { icon: Eye, title: "Performance Proof", description: "Multi-chain verified PnL. Track performance across all EVM chains. Ethereum mainnet settlement for transparency. See how profits flow from fast chains to stable yields." },
  { icon: BrainCircuit, title: "Swarm Intelligence", description: "Cross-chain agent coordination. Arbitrage on Polygon, yield farm on Arbitrum, settle on Ethereum. Agents share intel across chains, compound returns, and optimize for long-term wealth." }
];

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 border-black/10 dark:border-white/20 bg-white dark:bg-white/10 p-3 backdrop-blur-xl shadow-sm dark:shadow-none transition-colors duration-500",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

const Icons = {
  notion: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-black dark:text-white transition-colors duration-500"
    >
      <path
        d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z"
        fill="currentColor"
      />
    </svg>
  ),
  openai: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="text-black dark:text-white transition-colors duration-500"
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" fill="currentColor" />
    </svg>
  ),
  googleDrive: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 87.3 78"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
        fill="#0066da"
      />
      <path
        d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"
        fill="#00ac47"
      />
      <path
        d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
        fill="#ea4335"
      />
    </svg>
  ),
  whatsapp: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 175.216 175.552"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
        fill="#25D366"
      />
    </svg>
  ),
  messenger: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#0084ff"
        d="M44,23.5C44,34.27,35.05,43,24,43c-1.651,0-3.25-0.194-4.784-0.564    c-0.465-0.112-0.951-0.069-1.379,0.145L13.46,44.77C12.33,45.335,11,44.513,11,43.249v-4.025c0-0.575-0.257-1.111-0.681-1.499    C6.425,34.165,4,29.11,4,23.5C4,12.73,12.95,4,24,4S44,12.73,44,23.5z"
      />
    </svg>
  ),
  user: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
      className="text-black dark:text-white transition-colors duration-500"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

const CombinedFactoryStudioCard = () => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="group relative p-4 sm:p-6 md:p-8 bg-white dark:bg-white/5 shadow-sm dark:shadow-none backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.08] hover:border-black/20 dark:hover:border-white/20 transition-all duration-500"
    >
      <div
        className="relative flex h-[200px] sm:h-[250px] md:h-[300px] w-full items-center justify-center overflow-hidden"
        ref={containerRef}
      >
        <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
          <div className="flex flex-col justify-center gap-2">
            <Circle ref={div1Ref}>
              <Icons.googleDrive />
            </Circle>
            <Circle ref={div2Ref}>
              <Icons.notion />
            </Circle>
            <Circle ref={div3Ref}>
              <Icons.whatsapp />
            </Circle>
            <Circle ref={div4Ref}>
              <Icons.messenger />
            </Circle>
            <Circle ref={div5Ref}>
              <Bot className="w-6 h-6 text-black dark:text-white transition-colors duration-500" />
            </Circle>
          </div>
          <div className="flex flex-col justify-center">
            <Circle ref={div6Ref} className="size-16">
              <Icons.openai />
            </Circle>
          </div>
          <div className="flex flex-col justify-center">
            <Circle ref={div7Ref}>
              <Icons.user />
            </Circle>
          </div>
        </div>

        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div1Ref}
          toRef={div6Ref}
          gradientStartColor="#ff6b35"
          gradientStopColor="#f7931e"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div2Ref}
          toRef={div6Ref}
          gradientStartColor="#ff6b35"
          gradientStopColor="#f7931e"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div3Ref}
          toRef={div6Ref}
          gradientStartColor="#ff6b35"
          gradientStopColor="#f7931e"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div4Ref}
          toRef={div6Ref}
          gradientStartColor="#ff6b35"
          gradientStopColor="#f7931e"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div5Ref}
          toRef={div6Ref}
          gradientStartColor="#ff6b35"
          gradientStopColor="#f7931e"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div6Ref}
          toRef={div7Ref}
          gradientStartColor="#00d4ff"
          gradientStopColor="#0066ff"
        />
      </div>
    </motion.div>
  );
};

const ServiceCard = ({ service, index, tall }: { service: ServiceType, index: number, tall?: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const Icon = service.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.1 
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={`group relative p-4 sm:p-6 md:p-8 bg-white dark:bg-white/5 shadow-sm dark:shadow-none backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.08] hover:border-black/20 dark:hover:border-white/20 transition-all duration-500 ${tall ? 'h-full flex flex-col' : ''}`}
    >
      <div className={`relative z-10 ${tall ? 'h-full flex flex-col' : ''}`}>
        <div className={tall ? 'flex-1 flex flex-col justify-center' : ''}>
          <div className="inline-flex p-2 sm:p-3 rounded-xl bg-black/5 dark:bg-white/10 mb-4 sm:mb-6 group-hover:bg-black/10 dark:group-hover:bg-white/20 transition-colors duration-300 w-fit">
            <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-black dark:text-white transition-colors duration-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-3 sm:mb-4 transition-colors duration-500">{service.title}</h3>
          <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed transition-colors duration-500">{service.description}</p>
        </div>
        {service.title === "Agent Cloud" && tall && (
          <div className="relative h-64 overflow-hidden -mb-8">
            <Globe className="top-0" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function ServicesSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" });

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 md:py-32 bg-gray-50 dark:bg-[#0A0A0A] relative overflow-hidden transition-colors duration-500" id="services">
      {/* Background orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-black/5 dark:from-white/3 to-gray-400/5 dark:to-gray-400/3 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gradient-to-l from-gray-300/5 dark:from-gray-300/3 to-black/5 dark:to-white/3 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-sm font-medium text-black/60 dark:text-white/60 tracking-wider uppercase"
          >
            Multi-Chain Agent Operating System
          </motion.span>
          <h2 className="mt-4 text-5xl md:text-6xl font-light text-black dark:text-white tracking-tighter">
            Not Just Trading—<br />
            <span className="font-medium">Wealth Building</span>
          </h2>
          <p className="mt-6 text-lg text-black/60 dark:text-white/60 max-w-2xl mx-auto leading-relaxed">
            Execute on low-gas chains. Build wealth on Ethereum.<br />
            EVM-native agents that trade fast, rotate profits to blue-chips, and compound yields automatically.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 max-w-7xl mx-auto">
          <div className="col-span-full sm:col-span-2 md:col-span-4 lg:col-span-4">
            <CombinedFactoryStudioCard />
          </div>
          <div className="col-span-full sm:col-span-2 md:col-span-2 lg:col-span-2 md:row-span-3">
            <ServiceCard service={services[2]} index={2} tall={3} />
          </div>
          <div className="col-span-full sm:col-span-1 md:col-span-2 lg:col-span-2">
            <ServiceCard service={services[3]} index={3} />
          </div>
          <div className="col-span-full sm:col-span-1 md:col-span-2 lg:col-span-2 md:row-span-2">
            <ServiceCard service={services[4]} index={4} tall={2} />
          </div>
          <div className="col-span-full sm:col-span-2 md:col-span-2 lg:col-span-2">
            <ServiceCard service={services[5]} index={5} />
          </div>
        </div>
      </div>
    </section>
  );
}