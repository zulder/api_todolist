import prisma from '../../../shared/utils/prisma';
import { itemRepository } from '../../../api/items/itemRepository';

jest.mock('../../../shared/utils/prisma', () => ({
  todos: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $disconnect: jest.fn(),
}));

describe('itemRepository', () => {
  afterAll(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a item', async () => {
    const mockItem = { id: 1, name: 'foo', description: 'bar' };
    (prisma.todos.create as jest.Mock).mockResolvedValue(mockItem);

    const result = await itemRepository.createItem({
      name: 'foo',
      description: 'bar',
    });

    expect(prisma.todos.create).toHaveBeenCalledTimes(1);
    expect(prisma.todos.create).toHaveBeenCalledWith({
      data: { name: 'foo', description: 'bar' },
    });
    expect(result).toEqual(mockItem);
  });

  it('should get all items', async () => {
    const mockItems = [
      { id: 1, name: 'foo', description: 'bar' },
      { id: 2, name: 'baz', description: 'qux' },
    ];
    (prisma.todos.findMany as jest.Mock).mockResolvedValue(mockItems);

    const result = await itemRepository.findAllItems();
    expect(prisma.todos.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockItems);
  });

  it('should find item by id', async () => {
    const mockItem = { id: 1, name: 'foo', description: 'bar' };
    (prisma.todos.findUnique as jest.Mock).mockReturnValue(mockItem);

    const result = await itemRepository.findItemById(mockItem.id);
    expect(prisma.todos.findUnique).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockItem);
  });

  it('should update item by id', async () => {
    const mockItem = { id: 1, name: 'updated foo', description: 'updated bar' };
    (prisma.todos.update as jest.Mock).mockResolvedValue(mockItem);

    const result = await itemRepository.updateItem(1, {
      name: 'updated foo',
      description: 'updated bar',
    });

    expect(prisma.todos.update).toHaveBeenCalledTimes(1);
    expect(prisma.todos.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: 'updated foo', description: 'updated bar' },
    });
    expect(result).toEqual(mockItem);
  });

  it('should delete item by id', async () => {
    const mockItem = { id: 1, name: 'foo', description: 'bar' };
    (prisma.todos.delete as jest.Mock).mockResolvedValue(mockItem);

    const result = await itemRepository.deleteItem(1);

    expect(prisma.todos.delete).toHaveBeenCalledTimes(1);
    expect(prisma.todos.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockItem);
  });
});
