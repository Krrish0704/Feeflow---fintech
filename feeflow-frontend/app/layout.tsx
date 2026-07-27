"use client";
import { ReactLenis } from 'lenis/react';
import { motion } from "framer-motion";
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Add suppressHydrationWarning here
    <html lang="en" suppressHydrationWarning> 
      
      {/* Add suppressHydrationWarning here too */}
      <body className="bg-slate-950 text-white overflow-x-hidden min-h-screen" suppressHydrationWarning>
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
          
          {/* Animated Background Orbs */}
          <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 100, 0],
                y: [0, -50, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/30 blur-[120px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                x: [0, -100, 0],
                y: [0, 100, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-emerald-500/20 blur-[150px]" 
            />
          </div>

          {/* Main App Content */}
          <main className="relative z-10">
            {children}
          </main>

        </ReactLenis>
      </body>
    </html>
  );
}