'use client'

export function DropZoneIndicator({ isVisible, position = 'top' }) {
  if (!isVisible) return null;

  return (
    <div className={`
      w-full h-1 bg-primary rounded-full transition-all duration-200 opacity-75
      ${position === 'top' ? 'mb-2' : 'mt-2'}
      animate-pulse
    `}>
      <div className="w-full h-full bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-full" />
    </div>
  );
}
