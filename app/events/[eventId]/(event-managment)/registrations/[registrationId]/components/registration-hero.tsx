'use client';

import { Registration } from '../registration-type';
import { Download, MessageSquare, Mail, MoreHorizontal } from 'lucide-react';
import { HeroActionButton } from './hero-action-button';
import { motion } from 'framer-motion';

export function RegistrationHero({ registration }: { registration: Registration }) {
  const placeholderBannerUrl = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=400&fit=crop';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl shadow-2xl"
    >
      {/* Banner Container */}
      <div className="relative h-48 md:h-64 overflow-hidden group">
        {/* Banner Image */}
        <div className="absolute inset-0">
          <img
            src={placeholderBannerUrl}
            alt="Event Banner"
            className="w-full h-full object-cover opacity-60"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900" />
          {/* Floating gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/10" />
        </div>

        {/* Status badge floating */}
        <div className="absolute top-4 right-4 z-10">
          <div className={`px-4 py-2 rounded-full backdrop-blur-md border ${getStatusBgColor(registration.status)} text-sm font-semibold`}>
            {registration.status}
          </div>
        </div>

        {/* Participant count badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="px-4 py-2 rounded-full backdrop-blur-md border border-white/20 bg-white/5 text-white text-sm font-medium">
            {registration.participantsCount} Participant{registration.participantsCount !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 md:px-8 py-8 md:py-10">
        {/* Event Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Premium Event Ticket
            </h2>
            <p className="text-slate-400 text-base">
              Your registration is secure and confirmed. Access all event benefits and networking opportunities.
            </p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Ticket ID</p>
                <p className="text-sm font-semibold text-white mt-1 font-mono">{registration.ticketId}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Registration ID</p>
                <p className="text-sm font-semibold text-white mt-1 font-mono">{registration._id.slice(0, 8)}...</p>
              </div>
            </div>
          </div>

          {/* Right Column - QR Preview */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10">
            <div className="w-32 h-32 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-24 h-24 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
              </svg>
            </div>
            <p className="mt-3 text-sm text-slate-400">QR Code</p>
          </div>
        </div>

        {/* Pricing Info */}
        {registration.pricing && (
          <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-white font-medium">
                {registration.pricing.currency} {registration.pricing.subtotal.toFixed(2)}
              </span>
            </div>
            {registration.pricing.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Discount</span>
                <span className="text-emerald-400 font-medium">
                  -{registration.pricing.currency} {registration.pricing.discount.toFixed(2)}
                </span>
              </div>
            )}
            {registration.pricing.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tax</span>
                <span className="text-white font-medium">
                  {registration.pricing.currency} {registration.pricing.tax.toFixed(2)}
                </span>
              </div>
            )}
            <div className="border-t border-white/10 pt-3 flex justify-between">
              <span className="text-white font-semibold">Total</span>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {registration.pricing.currency} {registration.pricing.total.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <HeroActionButton icon={Download} label="Download Ticket" />
          <HeroActionButton icon={MessageSquare} label="WhatsApp" variant="secondary" />
          <HeroActionButton icon={Mail} label="Email Ticket" variant="secondary" />
          <HeroActionButton icon={MoreHorizontal} label="More" variant="secondary" />
        </div>
      </div>

      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
        }}
      />
    </motion.div>
  );
}

function getStatusBgColor(status: string): string {
  const colors: Record<string, string> = {
    CONFIRMED: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    PENDING_PAYMENT: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    DRAFT: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
    APPROVAL_PENDING: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
    FAILED: 'border-red-500/30 bg-red-500/10 text-red-300',
    CANCELLED: 'border-slate-600/30 bg-slate-600/10 text-slate-300',
  };
  return colors[status] || 'border-slate-500/30 bg-slate-500/10 text-slate-300';
}
