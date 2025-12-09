"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isLight = theme === "light";
  const size = 32; // Adjusted size
  const switchWidth = size * 1.8;
  const switchHeight = size * 1;
  const knobSize = switchHeight * 0.8;
  const knobIconSize = knobSize * 0.6;
  const borderRadius = switchHeight / 2;

  const toggleTheme = () => {
    setTheme(isLight ? "dark" : "light");
  };

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        width: switchWidth,
        height: switchHeight,
        background: isLight ? "#DBDBDB" : "#424242",
        border: "none",
        borderRadius: borderRadius,
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s",
        boxShadow: isLight
          ? "0 1px 3px rgba(0,0,0,0.06)"
          : "0 2px 8px rgba(0,0,0,0.10)",
        outline: "none",
        padding: 0,
      }}
      aria-label="Toggle theme"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        style={{
          position: "absolute",
          top: (switchHeight - knobSize) / 2,
          left: isLight
            ? switchWidth - knobSize - (switchHeight - knobSize) / 2
            : (switchHeight - knobSize) / 2,
          width: knobSize,
          height: knobSize,
          borderRadius: "50%",
          background: "#FFFFFF",
          boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        {isLight ? (
          <Sun size={knobIconSize} color="#FF9100" />
        ) : (
          <Moon size={knobIconSize} color="#6B6B6B" />
        )}
      </motion.span>
    </motion.button>
  );
}
