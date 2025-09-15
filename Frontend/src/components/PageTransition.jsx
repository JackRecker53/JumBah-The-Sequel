import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  // Choose your transition style here:
  // 'fade' - Simple fade in/out
  // 'slideUp' - Gentle slide up from bottom
  // 'slideRight' - Subtle slide from right
  // 'scale' - Gentle zoom effect
  // 'none' - No transition (instant)
  
  const transitionType = 'fade'; // Change this to try different effects!

  const transitionConfigs = {
    fade: {
      variants: {
        initial: { opacity: 0 },
        in: { opacity: 1 },
        out: { opacity: 0 }
      },
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    
    slideUp: {
      variants: {
        initial: { opacity: 0, y: 20 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -20 }
      },
      transition: { duration: 0.3, ease: "easeOut" }
    },
    
    slideRight: {
      variants: {
        initial: { opacity: 0, x: 20 },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: -20 }
      },
      transition: { duration: 0.25, ease: "easeInOut" }
    },
    
    scale: {
      variants: {
        initial: { opacity: 0, scale: 0.95 },
        in: { opacity: 1, scale: 1 },
        out: { opacity: 0, scale: 1.05 }
      },
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    
    none: {
      variants: {
        initial: { opacity: 1 },
        in: { opacity: 1 },
        out: { opacity: 1 }
      },
      transition: { duration: 0 }
    }
  };

  const config = transitionConfigs[transitionType];

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={config.variants}
      transition={config.transition}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;