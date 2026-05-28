'use client';

import { Registration } from '../registration-type';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail, MessageSquare, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityTimelineProps {
  registration: Registration;
}

export function ActivityTimeline({ registration }: ActivityTimelineProps) {
  const createdDate = new Date(registration.createdAt);

  const activities = [
    {
      id: 'created',
      label: 'Registration Created',
      timestamp: createdDate,
      icon: Calendar,
      color: 'from-purple-500 to-blue-500',
      completed: true,
    },
    {
      id: 'email',
      label: 'Confirmation Email Sent',
      timestamp: new Date(createdDate.getTime() + 5 * 60000),
      icon: Mail,
      color: 'from-blue-500 to-cyan-500',
      completed: registration.participantIds.some((p) => p.notifications.emailSent),
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Notification Sent',
      timestamp: new Date(createdDate.getTime() + 10 * 60000),
      icon: MessageSquare,
      color: 'from-cyan-500 to-emerald-500',
      completed: registration.participantIds.some((p) => p.notifications.whatsAppSent),
    },
    {
      id: 'checkin',
      label: 'Participant Check-in',
      timestamp: new Date(),
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-500',
      completed: registration.participantIds.some((p) => p.status === 'CHECKED_IN'),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 md:px-8 py-6 border-b border-white/10">
        <h3 className="text-2xl font-bold text-white">Activity Timeline</h3>
        <p className="text-slate-400 text-sm mt-1">Key milestones and events</p>
      </div>

      {/* Timeline */}
      <div className="p-6 md:p-8">
        <div className="relative space-y-6">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            const isLast = index === activities.length - 1;

            return (
              <motion.div key={activity.id} variants={itemVariants} className="relative flex gap-6">
                {/* Timeline Connector */}
                {!isLast && (
                  <div className="absolute left-5 top-14 bottom-0 w-0.5 bg-gradient-to-b from-white/20 to-transparent" />
                )}

                {/* Icon Circle */}
                <div className="relative z-10 flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.15 + 0.3, type: 'spring', stiffness: 200 }}
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${activity.color} flex items-center justify-center shadow-lg ${
                      activity.completed ? 'shadow-lg' : 'opacity-50'
                    }`}
                  >
                    <Icon size={20} className="text-white" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-white">{activity.label}</h4>
                      <p className="text-sm text-slate-400 mt-1">
                        {format(activity.timestamp, 'MMM dd, yyyy • HH:mm')}
                      </p>
                    </div>
                    {activity.completed && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.15 + 0.4 }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-300 flex-shrink-0"
                      >
                        Completed
                      </motion.div>
                    )}
                    {!activity.completed && (
                      <div className="px-2.5 py-1 rounded-lg bg-slate-500/20 border border-slate-500/30 text-xs font-semibold text-slate-300 flex-shrink-0">
                        Pending
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
