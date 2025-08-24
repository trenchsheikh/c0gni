import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const sections = [
  { id: "hero", label: "Home" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" }
];

export default function ScrollNavigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      const scrollPosition = currentScrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center h-16 px-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="cursor-pointer pr-4 mr-4 border-r border-white/10"
          onClick={() => scrollToSection('hero')}
        >
          <Image src="/c0gni-white.svg" alt="C0gni Labs" width={150} height={50} className="h-12" />
        </motion.div>
        
        <div className="flex items-center gap-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="relative px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white transition-all duration-300 ease-out"
            >
              {activeSection === section.id && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{section.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}