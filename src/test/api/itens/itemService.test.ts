import {
  createItemService,
  getAllItemsService,
  findItemByIdService,
  updateItemService,
  deleteItemService,
} from '../../../api/items/itemService';
import { itemRepository } from '../../../api/items/itemRepository';
import { IItem } from '../../../@types/items/IItem';
import AppError from '../../../shared/errors/AppError';

jest.mock('../../../api/items/itemRepository', () => ({
  itemRepository: {
    createItem: jest.fn(),
    findAllItems: jest.fn(),
    findItemById: jest.fn(),
    updateItem: jest.fn(),
    deleteItem: jest.fn(),
  },
}));

describe('ItemService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createItemService', () => {
    it('should create an item successfully', async () => {
      const mockItem: IItem = {
        id: 1,
        name: 'test Item',
        description: 'test description',
        created_at: new Date(),
        updated_at: new Date(),
      };
      // configura mock para repositório
      (itemRepository.createItem as jest.Mock).mockResolvedValue(mockItem);

      //Dados de entrada
      const inputData: IItem = {
        name: 'test Item',
        description: 'test description',
      };

      //Executa o serviço
      const result = await createItemService(inputData);

      expect(itemRepository.createItem).toHaveBeenCalledTimes(1);
      expect(itemRepository.createItem).toHaveBeenCalledWith(inputData);
      expect(result).toEqual(mockItem);
    });
    it('should throw an error when the repository fails', async () => {
      const mockError = new Error('Repository error');
      (itemRepository.createItem as jest.Mock).mockRejectedValue(mockError);

      const inputData: IItem = {
        name: 'test Item',
        description: 'test description',
      };

      //verifica serviço lançando error
      await expect(createItemService(inputData)).rejects.toThrow(
        'Repository error',
      );

      expect(itemRepository.createItem).toHaveBeenCalledTimes(1);
      expect(itemRepository.createItem).toHaveBeenCalledWith(inputData);
    });
  });

  describe('getAllItemsService', () => {
    it('should return all items successfully', async () => {
      const mockItems: IItem[] = [
        {
          id: 1,
          name: 'Item 1',
          description: 'Description 1',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: 'Item 2',
          description: 'Description 2',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      (itemRepository.findAllItems as jest.Mock).mockResolvedValue(mockItems);

      const result = await getAllItemsService();

      expect(itemRepository.findAllItems).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockItems);
    });

    it('should throw an error when no items are found', async () => {
      (itemRepository.findAllItems as jest.Mock).mockResolvedValue([]);

      await expect(getAllItemsService()).rejects.toThrow(
        new AppError('No items found'),
      );

      expect(itemRepository.findAllItems).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the repository fails', async () => {
      const mockError = new Error('Repository error');
      (itemRepository.findAllItems as jest.Mock).mockRejectedValue(mockError);

      await expect(getAllItemsService()).rejects.toThrow('Repository error');

      expect(itemRepository.findAllItems).toHaveBeenCalledTimes(1);
    });
  });

  describe('findItemByIdService', () => {
    it('should return the item with the id', async () => {
      const mockItem: IItem = {
        id: 1,
        name: 'Item 1',
        description: 'Description 1',
        created_at: new Date(),
        updated_at: new Date(),
      };
      (itemRepository.findItemById as jest.Mock).mockResolvedValue(mockItem);

      const result = await findItemByIdService(1);

      expect(itemRepository.findItemById).toHaveBeenCalledTimes(1);
      expect(itemRepository.findItemById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockItem);
    });
    it('should throw an error when item are not found', async () => {
      (itemRepository.findItemById as jest.Mock).mockResolvedValue(null);

      await expect(findItemByIdService(1)).rejects.toThrow(
        new AppError('Item not found!', 404),
      );

      expect(itemRepository.findItemById).toHaveBeenCalledTimes(1);
      expect(itemRepository.findItemById).toHaveBeenCalledWith(1);
    });
    it('should throw an error when the repository fails', async () => {
      const mockError = new Error('Repository error');

      (itemRepository.findItemById as jest.Mock).mockRejectedValue(mockError);

      await expect(findItemByIdService(1)).rejects.toThrow('Repository error');

      expect(itemRepository.findItemById).toHaveBeenCalledTimes(1);
      expect(itemRepository.findItemById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateItemService', () => {
    it('should update the item with valid id', async () => {
      const mockItem: IItem = {
        name: 'update test Item',
        description: 'update test description',
      };
      (itemRepository.updateItem as jest.Mock).mockResolvedValue(mockItem);

      const result = await updateItemService(1, mockItem);

      expect(itemRepository.updateItem).toHaveBeenCalledTimes(1);
      expect(itemRepository.updateItem).toHaveBeenCalledWith(1, mockItem);
      expect(result).toEqual(mockItem);
    });

    it('should throw an error if the item is not found', async () => {
      (itemRepository.updateItem as jest.Mock).mockResolvedValue(null);

      await expect(
        updateItemService(1, { name: 'Item', description: null }),
      ).rejects.toThrow('Item not found');

      expect(itemRepository.updateItem).toHaveBeenCalledTimes(1);
      expect(itemRepository.updateItem).toHaveBeenCalledWith(1, {
        name: 'Item',
        description: null,
      });
    });

    it('should throw an error when the repository fails', async () => {
      const mockError = new Error('Repository error');

      (itemRepository.updateItem as jest.Mock).mockRejectedValue(mockError);

      await expect(
        updateItemService(1, { name: 'Item', description: null }),
      ).rejects.toThrow('Repository error');

      expect(itemRepository.updateItem).toHaveBeenCalledTimes(1);
      expect(itemRepository.updateItem).toHaveBeenCalledWith(1, {
        name: 'Item',
        description: null,
      });
    });
  });

  describe('deleteItemService', () => {
    it('should delete the item successfully', async () => {
      (itemRepository.findItemById as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Test Item',
        description: 'Test description',
      });

      (itemRepository.deleteItem as jest.Mock).mockResolvedValue(undefined);

      await deleteItemService(1);

      expect(itemRepository.findItemById).toHaveBeenCalledTimes(1);
      expect(itemRepository.findItemById).toHaveBeenCalledWith(1);

      expect(itemRepository.deleteItem).toHaveBeenCalledTimes(1);
      expect(itemRepository.deleteItem).toHaveBeenCalledWith(1);
    });

    it('should throw an error if the item is not found', async () => {
      (itemRepository.findItemById as jest.Mock).mockResolvedValue(null);

      await expect(deleteItemService(1)).rejects.toThrow(
        new AppError('Item not found!', 404),
      );

      expect(itemRepository.findItemById).toHaveBeenCalledTimes(1);
      expect(itemRepository.findItemById).toHaveBeenCalledWith(1);

      //Não encontrou a função não deve ser chamada
      expect(itemRepository.deleteItem).not.toHaveBeenCalled();
    });

    it('should throw an error when the repository fails', async () => {
      (itemRepository.findItemById as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Test Item',
        description: 'Test description',
      });

      (itemRepository.deleteItem as jest.Mock).mockRejectedValue(
        new Error('Repository error'),
      );

      await expect(deleteItemService(1)).rejects.toThrow('Repository error');

      expect(itemRepository.findItemById).toHaveBeenCalledTimes(1);
      expect(itemRepository.findItemById).toHaveBeenCalledWith(1);

      expect(itemRepository.deleteItem).toHaveBeenCalledTimes(1);
      expect(itemRepository.deleteItem).toHaveBeenCalledWith(1);
    });
  });
});
