"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface PressButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  buttonGradient?: { start: string; end: string };
  labelGradient?: { start: string; end: string };
  icon?: React.ReactNode;
}

export default function PressButton({
  label,
  buttonGradient,
  labelGradient,
  icon,
  onClick,
  className,
  style,
  ...props
}: PressButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = !mounted || resolvedTheme === "dark";

  // Defaults based on theme
  const defaultButtonGradient = isDark 
    ? { start: "rgba(230, 230, 230, 1)", end: "rgba(180, 180, 180, 1)" }
    : { start: "rgba(255, 255, 255, 1)", end: "rgba(240, 240, 240, 1)" };

  const defaultLabelGradient = isDark
    ? { start: "rgba(25, 25, 25, 1)", end: "rgba(75, 75, 75, 1)" }
    : { start: "rgba(0, 0, 0, 1)", end: "rgba(50, 50, 50, 1)" };

  const bgGradient = buttonGradient || defaultButtonGradient;
  const txtGradient = labelGradient || defaultLabelGradient;

  return (
    <button
      style={{
        all: "unset",
        cursor: "pointer",
        position: "relative",
        borderRadius: "100em",
        backgroundColor: isDark ? "rgba(0, 0, 0, 0.75)" : "rgba(0, 0, 0, 0.1)",
        boxShadow: isDark
          ? "-0.15em -0.15em 0.15em -0.075em rgba(5, 5, 5, 0.25), 0.0375em 0.0375em 0.0675em 0 rgba(5, 5, 5, 0.1)"
          : "-0.15em -0.15em 0.15em -0.075em rgba(255, 255, 255, 0.5), 0.0375em 0.0375em 0.0675em 0 rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsActive(true);
        }
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsActive(false);
          if (onClick) onClick(e as any);
        }
      }}
      {...props}
    >
      {/* Glare effect */}
      <div
        style={{
          position: "absolute",
          zIndex: 0,
          width: "calc(100% + 0.3em)",
          height: "calc(100% + 0.3em)",
          top: "-0.15em",
          left: "-0.15em",
          borderRadius: "inherit",
          background:
            "linear-gradient(-135deg, rgba(5, 5, 5, 0.5), transparent 20%, transparent 100%)",
          filter: "blur(0.0125em)",
          opacity: 0.25,
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />

      {/* Shadow container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius: "inherit",
          transition: "box-shadow 300ms ease",
          willChange: "box-shadow",
          boxShadow: isHovered
            ? isDark 
              ? "0 0 0 0 rgba(5, 5, 5, 1), 0 0 0 0 rgba(5, 5, 5, 0.5), 0 0 0 0 rgba(5, 5, 5, 0.25)"
              : "0 0 0 0 rgba(0,0,0,0.1), 0 0 0 0 rgba(0,0,0,0.05)"
            : isDark
              ? "0 0.05em 0.05em -0.01em rgba(5, 5, 5, 1), 0 0.01em 0.01em -0.01em rgba(5, 5, 5, 0.5), 0.15em 0.3em 0.1em -0.01em rgba(5, 5, 5, 0.25)"
              : "0 0.05em 0.05em -0.01em rgba(0,0,0,0.2), 0 0.01em 0.01em -0.01em rgba(0,0,0,0.1), 0.15em 0.3em 0.1em -0.01em rgba(0,0,0,0.05)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Main button gradient and inner shadows */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            borderRadius: "inherit",
            padding: "1rem 2rem",
            backgroundImage: `linear-gradient(135deg, ${bgGradient.start}, ${bgGradient.end})`,
            transition:
              "box-shadow 300ms ease, clip-path 250ms ease, background-image 250ms ease, transform 250ms ease",
            willChange: "box-shadow, clip-path, background-image, transform",
            overflow: "hidden",
            clipPath: isHovered
              ? "inset(clamp(1px, 0.0625em, 2px) clamp(1px, 0.0625em, 2px) clamp(1px, 0.0625em, 2px) clamp(1px, 0.0625em, 2px) round 100em)"
              : "inset(0 0 0 0 round 100em)",
            boxShadow: isHovered
              ? isDark
                ? "0.1em 0.15em 0.05em 0 inset rgba(5, 5, 5, 0.75), -0.025em -0.03em 0.05em 0.025em inset rgba(5, 5, 5, 0.5), 0.25em 0.25em 0.2em 0 inset rgba(5, 5, 5, 0.5), 0 0 0.05em 0.5em inset rgba(255, 255, 255, 0.15), 0 0 0 0 inset rgba(255, 255, 255, 1), 0.12em 0.12em 0.12em inset rgba(255, 255, 255, 0.25), -0.075em -0.12em 0.2em 0.1em inset rgba(5, 5, 5, 0.25)"
                : "0.1em 0.15em 0.05em 0 inset rgba(0,0,0,0.1), -0.025em -0.03em 0.05em 0.025em inset rgba(0,0,0,0.05), 0.25em 0.25em 0.2em 0 inset rgba(0,0,0,0.05), 0 0 0.05em 0.5em inset rgba(255,255,255,0.5), 0 0 0 0 inset rgba(255,255,255,1)"
              : isDark
                ? "0 0 0 0 inset rgba(5, 5, 5, 0.1), -0.05em -0.05em 0.05em 0 inset rgba(5, 5, 5, 0.25), 0 0 0 0 inset rgba(5, 5, 5, 0.1), 0 0 0.05em 0.2em inset rgba(255, 255, 255, 0.25), 0.025em 0.05em 0.1em 0 inset rgba(255, 255, 255, 1), 0.12em 0.12em 0.12em inset rgba(255, 255, 255, 0.25), -0.075em -0.25em 0.25em 0.1em inset rgba(5, 5, 5, 0.25)"
                : "0 0 0 0 inset rgba(0,0,0,0.05), -0.05em -0.05em 0.05em 0 inset rgba(0,0,0,0.1), 0 0 0 0 inset rgba(0,0,0,0.05), 0 0 0.05em 0.2em inset rgba(255,255,255,0.5), 0.025em 0.05em 0.1em 0 inset rgba(255,255,255,1)",
            transform: isActive ? "scale(0.975)" : "scale(1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            gap: "0.5rem", 
          }}
        >
          <span
            style={{
              position: "relative",
              zIndex: 4,
              letterSpacing: "-0.05em",
              color: "transparent",
              backgroundImage: `linear-gradient(135deg, ${txtGradient.start}, ${txtGradient.end})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              transition: "transform 250ms ease",
              display: "block",
              willChange: "transform",
              textShadow: "rgba(0, 0, 0, 0.1) 0 0 0.1em",
              userSelect: "none",
              transform: isHovered ? "scale(0.975)" : "scale(1)",
              textAlign: "center",
              width: "max-content",
              fontWeight: 500,
            }}
          >
            {label}
          </span>
          {icon && (
            <span
              style={{
                position: "relative", 
                zIndex: 4,
                color: txtGradient.start, 
                display: "flex", 
                alignItems: "center",
                transform: isHovered ? "scale(0.975)" : "scale(1)",
                transition: "transform 250ms ease",
              }}
            >
              {icon}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
