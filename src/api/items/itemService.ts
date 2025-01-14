import { IItem } from '../../@types/items/IItem';
import AppError from '../../shared/errors/AppError';
import { itemRepository } from './itemRepository';

export const createItemService = async (data: IItem): Promise<IItem> => {
  try {
    const item = await itemRepository.createItem(data);
    return item;
  } catch (error) {
    throw error;
  }
};

export const getAllItemsService = async (): Promise<IItem[]> => {
  try {
    const items = await itemRepository.findAllItems();
    if (items.length === 0) {
      throw new AppError('No items found');
    }
    return items;
  } catch (error) {
    throw error;
  }
};
export const findItemByIdService = async (id: number): Promise<IItem> => {
  try {
    const item = await itemRepository.findItemById(id);
    if (!item) {
      throw new AppError('Item not found!', 404);
    }
    return item;
  } catch (error) {
    throw error;
  }
};
export const updateItemService = async (
  id: number,
  data: IItem,
): Promise<IItem> => {
  try {
    const updatedItem = await itemRepository.updateItem(id, data);

    if (!updatedItem) {
      throw new AppError('Item not found!', 404);
    }

    return updatedItem;
  } catch (error) {
    throw error;
  }
};
export const deleteItemService = async (id: number) => {
  try {
    const item = await itemRepository.findItemById(id);
    if (!item) {
      throw new AppError('Item not found!', 404);
    }

    await itemRepository.deleteItem(id);
  } catch (error) {
    throw error;
  }
};
