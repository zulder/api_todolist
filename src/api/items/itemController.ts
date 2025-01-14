import { Request, Response } from 'express';
import { createSchema, findItemSchema, idSchema } from './itemSchema';
import AppError from '../../shared/errors/AppError';
import {
  createItemService,
  getAllItemsService,
  findItemByIdService,
  updateItemService,
  deleteItemService,
} from './itemService';

export const createItemController = async (req: Request, res: Response) => {
  try {
    const createValidation = createSchema.safeParse(req.body);
    if (!createValidation.success) {
      const messages = createValidation.error.issues.map((error) => ({
        field: error.path.join(', '),
        error: error.message,
      }));

      res.status(400).json({ error: 'Credentials error', messages: messages });
      return;
    }

    const { name, description } = createValidation.data;

    const item = { name, description };

    const newItem = await createItemService(item);

    res.status(201).json(newItem);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    } else if (error instanceof Error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
  }
};

export const getItemsController = async (req: Request, res: Response) => {
  try {
    const items = await getAllItemsService();
    if (items.length === 0) {
      res.status(401).json({ error: 'There are no items registered' });
      return;
    }
    res.status(200).json(items);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    } else if (error instanceof Error) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }
};

export const findItemController = async (req: Request, res: Response) => {
  try {
    const findItemValidator = findItemSchema.safeParse(req.params);
    if (!findItemValidator.success) {
      res
        .status(400)
        .json({ error: findItemValidator.error.issues[0].message });
      return;
    }

    const { id } = findItemValidator.data;
    const itemId = Number(id);

    const item = await findItemByIdService(itemId);
    if (!item) {
      res.status(404).json({ error: 'Item not found!' });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    } else if (error instanceof Error) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }
};

export const updateItemController = async (req: Request, res: Response) => {
  try {
    const idValidation = idSchema.safeParse(req.params);
    if (!idValidation.success) {
      res.status(400).json({ error: idValidation.error.issues[0].message });
      return;
    }
    const { id } = idValidation.data;
    const itemId = Number(id);

    const findItem = await findItemByIdService(itemId);
    if (!findItem) {
      res.status(404).json({ error: 'Item not found!' });
      return;
    }

    const item = {
      name: req.body.name || findItem.name,
      description: req.body.description || findItem.description,
    };

    const updateItem = await updateItemService(itemId, item);
    res.status(200).json(updateItem);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    } else if (error instanceof Error) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }
};

export const deleteItemController = async (req: Request, res: Response) => {
  try {
    const idValidation = idSchema.safeParse(req.params);
    if (!idValidation.success) {
      res.status(400).json({ error: idValidation.error.issues[0].message });
      return;
    }
    const id = idValidation.data.id;
    const itemId = Number(id);

    const findItem = await findItemByIdService(itemId);
    if (!findItem) {
      res.status(404).json({ error: 'Item not found!' });
      return;
    }
    await deleteItemService(itemId);

    res.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    } else if (error instanceof Error) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }
};
