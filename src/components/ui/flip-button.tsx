"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FlipButtonProps {
  text1: string;
  text2: string;
  onClick?: () => void;
}

export function FlipButton({ text1, text2, onClick }: FlipButtonProps) {
  const [show, setShow] = useState(false);

  const flipVariants = {
    one: {
      rotateX: 0,
      backgroundColor: '#3b82f6',
      color: '#ffffff',
    },
    two: {
      rotateX: 180,
      backgroundColor: '#f4f4f5',
      color: '#18181b',
    },
  };

  return (
    <div className="w-full max-w-[270px]">
      <motion.button
        type="button"
        className="relative w-full cursor-pointer overflow-hidden px-6 py-3 font-medium"
        style={{
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: 'inset 1px 1px 1px rgba(255,255,255,0.35), inset -1px -1px 1px rgba(0,0,0,0.25)',
          WebkitBackdropFilter: 'blur(8px) saturate(150%)',
          backdropFilter: 'blur(8px) saturate(150%)',
          backgroundColor: show ? '#f4f4f5' : '#3b82f6',
          color: show ? '#18181b' : '#ffffff',
        }}
        onClick={() => {
          setShow((current) => !current);
          onClick?.();
        }}
        animate={show ? 'two' : 'one'}
        variants={flipVariants}
        transition={{ duration: 0.6, type: 'spring' }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotateX: show ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'absolute',
            inset: 0,
          }}
        >
          {show ? text2 : text1}
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotateX: show ? 0 : -180 }}
          transition={{ duration: 0.6, type: 'spring' }}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'absolute',
            inset: 0,
          }}
        >
          {show ? text1 : text2}
        </motion.div>
      </motion.button>
    </div>
  );
}
