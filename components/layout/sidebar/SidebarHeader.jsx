'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, IconChevronDown } from '@tabler/icons-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';

const SidebarHeader = ({ isCollapsed, onToggleCollapse, isMobile, organization }) => {
  return (
    <div className="relative w-full">
      {/* Header Container */}
      <div
        className={cn(
          'flex items-center justify-between px-4 py-4 gap-2',
          'bg-linear-to-b from-background to-background/80',
          'border-b border-border/50',
          'overflow-visible',
        )}
      >
        {/* Logo and Title */}
        <div className={cn('flex items-center gap-3', isCollapsed && !isMobile ? 'flex-col w-full' : 'flex-1 min-w-0')}>
          {isCollapsed && !isMobile ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                  <div className="relative h-8 w-8 flex items-center justify-center bg-accent rounded-md">
                    {organization?.logo ? (
                      <Image
                        src={organization.logo}
                        alt={organization.name || 'Organization'}
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain rounded-md"
                        priority
                      />
                    ) : (
                      <Image
                        src="/icons/icon.png"
                        alt="Orgatick"
                        width={32}
                        height={32}
                        className="h-6 w-6 object-contain"
                        priority
                      />
                    )}
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-semibold">{organization?.name || 'Orgatick'}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group min-w-0">
              <div className="relative h-8 w-8 flex items-center justify-center bg-accent rounded-md">
                {organization?.logo ? (
                  <Image
                    src={organization.logo}
                    alt={organization.name || 'Organization'}
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain rounded-md"
                    priority
                  />
                ) : (
                  <Image
                    src="/icons/icon.png"
                    alt="Orgatick"
                    width={32}
                    height={32}
                    className="h-6 w-6 object-contain"
                    priority
                  />
                )}
              </div>

              <AnimatePresence mode="wait">
                {(!isCollapsed || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden min-w-0"
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <h2 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {organization?.name || 'Orgatick'}
                      </h2>
                      <p className="text-xs text-muted-foreground truncate">
                        {organization?.category || 'Event Management'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          )}
        </div>

        {/* Collapse Button */}
        {!isMobile && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                onClick={onToggleCollapse}
                className={cn(
                  'flex items-center justify-center',
                  'text-muted-foreground',
                  'transition-colors duration-200',
                  isCollapsed && 'w-full mt-2',
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCollapsed ? (
                  <IconLayoutSidebarLeftExpand className="h-4 w-4" />
                ) : (
                  <IconLayoutSidebarLeftCollapse className="h-4 w-4" />
                )}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side={isCollapsed && !isMobile ? 'right' : 'bottom'}>
              <p className="text-xs">{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
