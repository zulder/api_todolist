import prisma from '../../shared/utils/prisma';

export const itemRepository = {
  createItem: async (data: { name: string; description?: string | null }) => {
    return await prisma.todos.create({ data });
  },
  findAllItems: async () => {
    return await prisma.todos.findMany();
  },
  findItemById: async (id: number) => {
    return await prisma.todos.findUnique({ where: { id } });
  },
  updateItem: async (
    id: number,
    data: { name: string; description?: string | null },
  ) => {
    return await prisma.todos.update({
      where: { id },
      data: data,
    });
  },
  deleteItem: async (id: number) => {
    return await prisma.todos.delete({ where: { id } });
  },
};
