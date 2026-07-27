"use client";
import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={`
        relative overflow-hidden rounded-3xl
        bg-white/10               
        backdrop-blur-xl          
        border border-white/20    
        shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] 
        
        before:absolute before:inset-0 before:-z-10 
        before:rounded-3xl before:bg-gradient-to-br 
        before:from-white/10 before:to-transparent 
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}