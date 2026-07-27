import { z } from "zod";

export const OfferLinkType = {
  NONE: "NONE",
  WHATSAPP: "WHATSAPP",
  EXTERNAL_URL: "EXTERNAL_URL",
  PRODUCT: "PRODUCT",
  CATEGORY: "CATEGORY",
  INSTAGRAM_REEL: "INSTAGRAM_REEL",
} as const;

export type OfferLinkType = keyof typeof OfferLinkType;

export const offerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  discountText: z.string().optional().nullable(),
  bannerImage: z.string().min(1, "Banner image is required"),
  bannerImageMobile: z.string().optional().nullable(),
  linkType: z.enum(["NONE", "WHATSAPP", "EXTERNAL_URL", "PRODUCT", "CATEGORY", "INSTAGRAM_REEL"]),
  linkValue: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  startDate: z.string().optional().nullable().transform((val) => val ? new Date(val) : null),
  endDate: z.string().optional().nullable().transform((val) => val ? new Date(val) : null),
});

export type OfferFormValues = z.infer<typeof offerSchema>;
