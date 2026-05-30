'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FullPageLoaderProps {
  className?: string;
  children?: React.ReactNode;
  showProgress?: boolean;
}

export function FullPageLoader({ className, children, showProgress = false }: FullPageLoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showProgress) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 20;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [showProgress]);

  return (
    <div
      className={cn('fixed inset-0 z-9999 flex flex-col items-center justify-center overflow-hidden', className)}
      role="status"
      aria-live="polite"
    >
      {/* Dynamic gradient background with multiple animated layers */}
      <div className="absolute inset-0 bg-background opacity-90" />

      {/* Animated gradient orbs - Premium effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full mix-blend-screen filter blur-3xl opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(79, 127, 217, 0.8) 0%, transparent 70%)',
            animation: 'float1 15s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-1/2 -right-40 w-80 h-80 rounded-full mix-blend-screen filter blur-3xl opacity-35"
          style={{
            background: 'radial-gradient(circle, rgba(192, 138, 58, 0.7) 0%, transparent 70%)',
            animation: 'float2 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full mix-blend-screen filter blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(127, 158, 229, 0.6) 0%, transparent 70%)',
            animation: 'float3 20s ease-in-out infinite',
          }}
        />
      </div>

      {/* Grid pattern overlay - adds depth */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(79, 127, 217, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(79, 127, 217, 0.5) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'moveGrid 20s linear infinite',
          }}
        />
      </div>

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 bg-radial-gradient pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(11, 18, 32, 0.3) 100%)',
        }}
      />

      {/* Backdrop blur */}
      <div className="absolute inset-0 backdrop-blur-lg bg-background/20" />

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Premium animated loader - 3D effect */}
        <div className="relative w-32 h-32 perspective">
          {/* Outer orbiting ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: 'var(--color-primary)',
              borderRightColor: 'rgba(79, 127, 217, 0.3)',
              boxShadow: '0 0 30px rgba(79, 127, 217, 0.5), inset 0 0 30px rgba(79, 127, 217, 0.2)',
              animation: 'spin3d 3s linear infinite',
            }}
          />

          {/* Second rotating ring - offset */}
          <div
            className="absolute inset-3 rounded-full border-2 border-transparent"
            style={{
              borderBottomColor: 'var(--color-accent)',
              borderLeftColor: 'rgba(127, 158, 229, 0.3)',
              boxShadow: '0 0 25px rgba(127, 158, 229, 0.4)',
              animation: 'spin3d 4s linear reverse infinite',
            }}
          />

          {/* Third rotating ring */}
          <div
            className="absolute inset-6 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: 'var(--color-secondary)',
              borderBottomColor: 'rgba(192, 138, 58, 0.3)',
              boxShadow: '0 0 20px rgba(192, 138, 58, 0.4)',
              animation: 'spin3d 5s linear infinite',
            }}
          />

          {/* Pulsing gradient core */}
          <div className="absolute inset-8 rounded-full overflow-hidden">
            <div
              className="w-full h-full bg-linear-to-r from-primary via-accent to-secondary"
              style={{
                animation: 'pulseGlow 2.5s ease-in-out infinite',
                boxShadow: '0 0 40px rgba(79, 127, 217, 0.8), inset 0 0 20px rgba(79, 127, 217, 0.4)',
              }}
            />
          </div>

          {/* Floating particles around loader */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-accent)',
                left: '50%',
                top: '50%',
                boxShadow: `0 0 10px ${i % 2 === 0 ? 'rgba(79, 127, 217, 0.8)' : 'rgba(127, 158, 229, 0.8)'}`,
                animation: `orbitParticle${i} 4s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        {/* Premium text section */}
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Main heading with glow effect */}
          <div className="relative">
            <h1 className="text-4xl md:text-5xl">{children ? children : 'Organizing Your Event'}</h1>
          </div>

          {/* Animated loading text */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-semibold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Loading
            </span>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-linear-to-b from-primary to-accent"
                  style={{
                    animation: `pulse-dot-anim 1.2s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                    boxShadow: '0 0 8px rgba(79, 127, 217, 0.6)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Status text - animated */}
          <p
            className="text-xs md:text-sm font-medium text-muted-foreground mt-2"
            style={{
              animation: 'fadeInOut 3s ease-in-out infinite',
            }}
          >
            Preparing your dashboard...
          </p>
        </div>

        {/* Progress bar - Ultra premium */}
        {showProgress && (
          <div className="w-72 mt-6">
            <div className="relative h-1.5 bg-muted rounded-full overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-linear-to-r from-muted/50 via-muted to-muted/50" />
              <div
                className="h-full bg-linear-to-r from-primary via-accent to-secondary rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  boxShadow: '0 0 15px rgba(79, 127, 217, 0.8), inset 0 0 8px rgba(255, 255, 255, 0.3)',
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-center mt-2 font-medium">{Math.round(progress)}%</div>
          </div>
        )}
      </div>

      {/* Animated background elements */}
      <style jsx>{`
        @keyframes float1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(50px, -80px) scale(1.1);
          }
          66% {
            transform: translate(-50px, 80px) scale(0.9);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-60px, 40px) scale(0.95);
          }
          66% {
            transform: translate(60px, -40px) scale(1.05);
          }
        }

        @keyframes float3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(40px, 60px) scale(1.05);
          }
          66% {
            transform: translate(-40px, -60px) scale(0.95);
          }
        }

        @keyframes spin3d {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
            filter: blur(0px);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
            filter: blur(2px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-dot-anim {
          0%,
          60%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          30% {
            opacity: 1;
            transform: scale(1.3);
          }
        }

        @keyframes moveGrid {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes orbitParticle0 {
          0%,
          100% {
            transform: translate(calc(50px * cos(0deg)), calc(50px * sin(0deg))) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(calc(50px * cos(180deg)), calc(50px * sin(180deg))) scale(0.5);
            opacity: 0.3;
          }
        }

        @keyframes orbitParticle1 {
          0%,
          100% {
            transform: translate(calc(50px * cos(90deg)), calc(50px * sin(90deg))) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(calc(50px * cos(270deg)), calc(50px * sin(270deg))) scale(0.5);
            opacity: 0.3;
          }
        }

        @keyframes orbitParticle2 {
          0%,
          100% {
            transform: translate(calc(50px * cos(180deg)), calc(50px * sin(180deg))) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(calc(50px * cos(0deg)), calc(50px * sin(0deg))) scale(0.5);
            opacity: 0.3;
          }
        }

        @keyframes orbitParticle3 {
          0%,
          100% {
            transform: translate(calc(50px * cos(270deg)), calc(50px * sin(270deg))) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(calc(50px * cos(90deg)), calc(50px * sin(90deg))) scale(0.5);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}
