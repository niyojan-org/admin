import z from 'zod';

export const ParticipantSchema = z.object({
  notifications: z.object({
    emailSent: z.boolean(),
    whatsAppSent: z.boolean(),
  }),
  _id: z.string(),
  registrationId: z.string(),
  eventId: z.string(),
  ticketId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  dynamicFields: z.record(z.string(), z.any()).optional(),
  status: z.enum(['REGISTERED', 'CHECKED_IN', 'CANCELLED']),
  sessionCheckIns: z.array(z.string()),
  __v: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const RegistrationStatusSchema = z.enum([
  'DRAFT',
  'APPROVAL_PENDING',
  'PENDING_PAYMENT',
  'CONFIRMED',
  'FAILED',
  'CANCELLED',
]);

const PricingSchema = z.object({
  subtotal: z.number(),
  discount: z.number(),
  tax: z.number(),
  total: z.number(),
  currency: z.string(),
});

export const RegistrationSchema = z.object({
  _id: z.string(),
  eventId: z.string(),
  ticketId: z.string(),
  participantIds: z.array(ParticipantSchema),
  participantsCount: z.number(),
  status: RegistrationStatusSchema,
  pricing: PricingSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),
});

export type Registration = z.infer<typeof RegistrationSchema>;
export type Participant = z.infer<typeof ParticipantSchema>;
