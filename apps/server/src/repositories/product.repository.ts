import { prisma } from '../config/prisma';
import { Prisma } from '@prisma/client';

export class ProductRepository {
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return prisma.product.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        category: true,
        brand: true,
        images: { orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  async count(where?: Prisma.ProductWhereInput) {
    return prisma.product.count({ where });
  }

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
