import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

const sections = [
  { id: "hero", label: "Home" },
  { id: "research", label: "Research", isLink: true, href: "/research" },
  { id: "docs", label: "Docs", isLink: true, href: "/docs" }
];

export default function ScrollNavigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
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
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block"
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
            {sections.map((section) => {
              if (section.isLink && section.href) {
                return (
                  <Link key={section.id} href={section.href}>
                    <button className="relative px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white transition-all duration-300 ease-out">
                      <span className="relative z-10">{section.label}</span>
                    </button>
                  </Link>
                );
              }
              return (
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
              );
            })}
          </div>
        </div>
      </motion.nav>

      {/* Floating Request Access Button - Desktop */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-8 z-50 hidden md:block"
        style={{ right: 'calc((100vw - 50vw) / 4)' }}
      >
        <div className="flex items-center h-12 px-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
          <Link href="/request-access">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative px-2 py-1 text-xs font-medium text-white/70 hover:text-white transition-all duration-300 ease-out rounded-full uppercase tracking-wide"
            >
              Request Access
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Mobile Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-4 right-4 z-50 md:hidden"
      >
        <div className="flex items-center justify-between h-14 px-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="cursor-pointer"
            onClick={() => scrollToSection('hero')}
          >
            <Image src="/c0gni-white.svg" alt="C0gni Labs" width={120} height={40} className="h-8" />
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white/70 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-[#0A0A0A]/95 backdrop-blur-xl border-l border-white/10"
            >
              <div className="flex flex-col h-full pt-20 px-6">
                {sections.map((section, index) => {
                  if (section.isLink && section.href) {
                    return (
                      <Link key={section.id} href={section.href}>
                        <motion.button
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="relative py-4 px-4 text-left text-lg font-medium rounded-xl transition-all duration-300 text-white/70 hover:text-white hover:bg-white/5"
                        >
                          {section.label}
                        </motion.button>
                      </Link>
                    );
                  }
                  return (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => scrollToSection(section.id)}
                      className={`relative py-4 px-4 text-left text-lg font-medium rounded-xl transition-all duration-300 ${
                        activeSection === section.id 
                          ? 'text-white bg-white/10' 
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {section.label}
                    </motion.button>
                  );
                })}
                
                {/* Request Access Button for Mobile */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: sections.length * 0.1 }}
                  className="mt-6 pt-6 border-t border-white/10"
                >
                  <Link href="/request-access">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl transition-all duration-300"
                    >
                      Request Access
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}