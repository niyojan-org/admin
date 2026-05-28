import z from 'zod';

const AddressSchema = z
  .object({
    locality: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
  })
  .partial();

const SupportContactSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  })
  .partial();

const SocialLinksSchema = z
  .object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    youtube: z.string().url().optional(),
    blog: z.string().url().optional(),
    website: z.string().url().optional(),
  })
  .partial();

const OrganizationStatsSchema = z
  .object({
    totalEventsHosted: z.number().optional(),
  })
  .partial();

const OrganizationDocumentSchema = z
  .object({
    _id: z.string().optional(),
    type: z.string().optional(),
    url: z.string().url().optional(),
    uploadedAt: z.string().optional(),
    verified: z.boolean().optional(),
    rejected: z.boolean().optional(),
  })
  .partial();

export const OrganizationDataSchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: AddressSchema.optional(),
  supportContact: SupportContactSchema.optional(),
  socialLinks: SocialLinksSchema.optional(),
  owner: z.string().optional(),
  verified: z.boolean().optional(),
  verifiedAt: z.string().optional(),
  verifiedBy: z.string().optional(),
  reqForVerification: z.boolean().optional(),
  trustScore: z.number().optional(),
  active: z.boolean().optional(),
  allowsEventCreation: z.boolean().optional(),
  fraudFlags: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
  isBlocked: z.boolean().optional(),
  allowsPaidEvents: z.boolean().optional(),
  stats: OrganizationStatsSchema.optional(),
  documents: z.array(OrganizationDocumentSchema).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type OrganizationData = z.infer<typeof OrganizationDataSchema>;
