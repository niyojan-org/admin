"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Carousel = ({ images = [], interval = 4000 }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev

  // Change image every interval
  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setDirection(1); // Moving to next imag
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  // Handle dot click with direction
  const handleDotClick = (index) => {
    if (index === currentImage) return;
    setDirection(index > currentImage ? 1 : -1);
    setCurrentImage(index);
  };

  if (images.length === 0) return null;

  // Animation variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      zIndex: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      zIndex: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      zIndex: 0,
    }),
  };

  return (
    <div className="w-full md:w-1/2 relative h-[170px] md:h-full overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentImage}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={images[currentImage]?.url}
            alt={images[currentImage]?.title || "Carousel Image"}
            className="object-cover size-full"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${idx === currentImage ? "bg-blue-600" : "bg-gray-300"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
