import { Request, Response } from 'express';
import {
  createItemController,
  getItemsController,
  findItemController,
  updateItemController,
  deleteItemController,
} from '../../../api/items/itemController';
import {
  createItemService,
  getAllItemsService,
  findItemByIdService,
  updateItemService,
  deleteItemService,
} from '../../../api/items/itemService';
import AppError from '../../../shared/errors/AppError';

jest.mock('../../../api/items/itemService');

describe('itemController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock; //for delete

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createItemController', () => {
    beforeEach(() => {
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      req = {
        body: {
          name: 'Valid Name',
          description: 'Valid description with more than 5 characters',
        },
      };
      res = { status: statusMock, json: jsonMock };
    });

    it('should create an item successfully', async () => {
      const mockItem = {
        id: 1,
        name: 'Valid Name',
        description: 'Valid description with more than 35 characters',
      };
      (createItemService as jest.Mock).mockResolvedValue(mockItem);

      await createItemController(req as Request, res as Response);

      expect(createItemService).toHaveBeenCalledWith(req.body);
      expect(createItemService).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockItem);
    });

    it('should return a 400 error when validation fails', async () => {
      req.body = {
        name: 'ab',
        description: 'shor',
      };

      await createItemController(req as Request, res as Response);

      expect(createItemService).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Credentials error',
        messages: [
          { field: 'name', error: 'Name must be 3 or more characters long' },
          {
            field: 'description',
            error: 'Name must be 5 or more characters long',
          },
        ],
      });
    });

    it('should handle generic error', async () => {
      const mockError = new Error('Unexpected error');
      (createItemService as jest.Mock).mockRejectedValue(mockError);

      req.body = { name: 'abc', description: 'short noting' };

      await createItemController(req as Request, res as Response);

      expect(createItemService).toHaveBeenCalledWith(req.body);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('getItemsController', () => {
    beforeEach(() => {
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      req = {};
      res = { status: statusMock, json: jsonMock };
    });

    it('should return all item successfully', async () => {
      const mockItems = [
        {
          id: 1,
          name: 'Valid Name',
          description: 'Valid description with more than 5 characters',
        },
        {
          id: 2,
          name: 'Valid Name 2',
          description: 'Valid description with more than 5 characters 2',
        },
      ];
      (getAllItemsService as jest.Mock).mockResolvedValue(mockItems);

      await getItemsController(req as Request, res as Response);

      expect(getAllItemsService).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockItems);
    });

    it('should return a 401 error when no item is found', async () => {
      (getAllItemsService as jest.Mock).mockResolvedValue([]);

      await getItemsController(req as Request, res as Response);

      expect(getAllItemsService).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'There are no items registered',
      });
    });

    it(`should handle generic error`, async () => {
      const mockError = new Error('Unexpected error');
      (getAllItemsService as jest.Mock).mockRejectedValue(mockError);

      await getItemsController(req as Request, res as Response);

      req.body = [{ name: 'teste', description: 'teste' }];

      expect(getAllItemsService).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('findItemController', () => {
    beforeEach(() => {
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      req = { params: { id: '1' } };
      res = { status: statusMock, json: jsonMock };
    });

    it('should return the item successfully', async () => {
      const mockItem = {
        id: 1,
        name: 'Valid name',
        description: 'Valid description',
      };
      (findItemByIdService as jest.Mock).mockResolvedValue(mockItem);

      await findItemController(req as Request, res as Response);

      expect(findItemByIdService).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockItem);
    });

    it('should return 400 if id is missing', async () => {
      req.params = {};

      await findItemController(req as Request, res as Response);

      expect(findItemByIdService).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'ID is required' });
    });

    it('should return 404 error if item is not found', async () => {
      (findItemByIdService as jest.Mock).mockRejectedValueOnce(
        new AppError('Item not found!', 404),
      );

      await findItemController(req as Request, res as Response);

      expect(findItemByIdService).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Item not found!' });
    });

    it('should handle generic error ', async () => {
      const mockError = new Error('Unexpected error');

      (findItemByIdService as jest.Mock).mockRejectedValueOnce(mockError);

      await findItemController(req as Request, res as Response);

      expect(findItemByIdService).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateItemController', () => {
    beforeEach(() => {
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      req = {
        params: { id: '1' },
        body: { name: 'Updated Name', description: 'Updated Description' },
      };
      res = { status: statusMock, json: jsonMock };
    });

    it('should update the item successfully', async () => {
      const mockUpdatedItem = {
        id: 1,
        name: 'Updated Name',
        description: 'Updated Description',
      };

      req.body = { name: 'Updated Name', description: 'Updated Description' };
      req.params = { id: '1' };

      (updateItemService as jest.Mock).mockResolvedValue(mockUpdatedItem);

      await updateItemController(req as Request, res as Response);

      expect(updateItemService).toHaveBeenNthCalledWith(
        1,
        Number(req.params.id),
        {
          name: req.body.name,
          description: req.body.description,
        },
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockUpdatedItem);
    });

    it('should return a 404 error if item is not found', async () => {
      (updateItemService as jest.Mock).mockRejectedValue(
        new AppError('Item not found!', 404),
      );

      await updateItemController(req as Request, res as Response);

      expect(updateItemService).toHaveBeenCalledWith(1, req.body);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Item not found!' });
    });

    it('should handle generic error', async () => {
      const mockError = new Error('Unexpected error');

      (updateItemService as jest.Mock).mockRejectedValue(mockError);

      await updateItemController(req as Request, res as Response);

      expect(updateItemService).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('deleteItemController', () => {
    beforeEach(() => {
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      sendMock = jest.fn().mockReturnThis();
      req = { params: { id: '1' } };
      res = {
        status: statusMock,
        json: jsonMock,
        send: sendMock,
      };
    });

    it('should delete item successfully', async () => {
      const mockItem = { id: 1, name: 'Item to delete' };
      (findItemByIdService as jest.Mock).mockResolvedValue(mockItem);

      (deleteItemService as jest.Mock).mockResolvedValue(undefined);

      req.params = { id: '1' };

      await deleteItemController(req as Request, res as Response);

      expect(deleteItemService).toHaveBeenCalledWith(Number(req.params.id));
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalled();
    });

    it('should return a 404 error if item is not found', async () => {
      (deleteItemService as jest.Mock).mockRejectedValue(
        new AppError('Item not found!', 404),
      );

      await deleteItemController(req as Request, res as Response);

      expect(deleteItemService).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Item not found!' });
      expect(sendMock).not.toHaveBeenCalled();
    });

    it('should return 500 if there is an error during deletion', async () => {
      (deleteItemService as jest.Mock).mockRejectedValue(
        new Error('Unexpected error'),
      );

      req.params = { id: '1' };

      await deleteItemController(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal server error' });
      expect(sendMock).not.toHaveBeenCalled();
    });
  });
});
