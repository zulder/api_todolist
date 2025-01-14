import { Request, Response } from 'express';
import { createSchema } from './itemSchema';
import AppError from '../../shared/errors/AppError';
import { createItemService } from './itemService';

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
