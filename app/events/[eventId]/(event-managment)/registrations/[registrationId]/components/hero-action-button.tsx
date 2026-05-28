'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface HeroActionButtonProps {
  icon: LucideIcon;
  label: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export function HeroActionButton({
  icon: Icon,
  label,
  variant = 'primary',
  onClick,
}: HeroActionButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
        isPrimary
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-500/50'
          : 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-white/30'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </motion.button>
  );
}
