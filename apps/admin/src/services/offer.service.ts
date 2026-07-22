import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const offerService = {
  list: async () => {
    const now = new Date();
    return prisma.offer.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null },
          { startDate: { lte: now } }
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } }
            ]
          }
        ]
      },
      orderBy: { displayOrder: "asc" },
    });
  },

  getById: async (id: string) => {
    return prisma.offer.findUnique({
      where: { id },
    });
  },

  create: async (data: Prisma.OfferCreateInput) => {
    try {
      // Find max displayOrder
      const lastOffer = await prisma.offer.findFirst({
        orderBy: { displayOrder: "desc" },
      });
      const nextOrder = lastOffer ? lastOffer.displayOrder + 1 : 0;

      const offer = await prisma.offer.create({
        data: {
          ...data,
          displayOrder: data.displayOrder ?? nextOrder,
        },
      });
      return { success: true, data: offer, message: "Offer created successfully" };
    } catch (error: any) {
      console.error("offerService.create error:", error);
      return { success: false, message: "Failed to create offer" };
    }
  },

  update: async (id: string, data: Prisma.OfferUpdateInput) => {
    try {
      const offer = await prisma.offer.update({
        where: { id },
        data,
      });
      return { success: true, data: offer, message: "Offer updated successfully" };
    } catch (error: any) {
      console.error("offerService.update error:", error);
      return { success: false, message: "Failed to update offer" };
    }
  },

  delete: async (id: string) => {
    try {
      await prisma.offer.delete({
        where: { id },
      });
      return { success: true, message: "Offer deleted successfully" };
    } catch (error: any) {
      console.error("offerService.delete error:", error);
      return { success: false, message: "Failed to delete offer" };
    }
  },

  reorder: async (updates: { id: string; displayOrder: number }[]) => {
    try {
      await prisma.$transaction(
        updates.map((update) =>
          prisma.offer.update({
            where: { id: update.id },
            data: { displayOrder: update.displayOrder },
          })
        )
      );
      return { success: true, message: "Offers reordered successfully" };
    } catch (error: any) {
      console.error("offerService.reorder error:", error);
      return { success: false, message: "Failed to reorder offers" };
    }
  }
};
