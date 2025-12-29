import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";

export default function RegistrationBanner({ bannerImage, title, onBack }) {
  if (!bannerImage) return null;

  return (
    <div className="relative w-full mb-4 sm:mb-6">
      {/* Banner Image Container */}
      <div className="relative w-full aspect-video max-h-48 sm:max-h-56 md:max-h-64 lg:max-h-72 rounded-lg sm:rounded-xl overflow-hidden shadow-lg border border-border">
        <Image 
          src={bannerImage} 
          alt={title} 
          fill 
          priority 
          className="object-cover object-center" 
        />
        
        {/* Gradient Overlay for better contrast */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/20" />
        
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5 sm:gap-2 rounded-lg backdrop-blur-md bg-background/40 text-white border border-white/50 hover:bg-background/60 hover:border-white/70 transition-all duration-200 shadow-lg text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2"
        >
          <IconArrowLeft size={16} className="w-4 h-4" /> 
          <span className="hidden xs:inline">Back</span>
        </Button>

        {/* Event Title Overlay */}
        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 bg-linear-to-t from-black/80 via-black/50 to-transparent">
            <h1 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold drop-shadow-lg line-clamp-2">
              {title}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
