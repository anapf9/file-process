import { FastifyInstance, FastifyRequest } from 'fastify';
import { orderRoutes, QueryStringRequestDTO } from './OrderController';
import { OrderService } from '../services/OrderService';
import { Container } from 'typescript-ioc';

jest.mock('../services/OrderService');

describe('OrderController', () => {
  let server: FastifyInstance;
  let orderService: OrderService;

  beforeAll(() => {
    server = {
      get: jest.fn(),
    } as unknown as FastifyInstance;
    orderService = Container.get(OrderService);
  });

  it('should register the /orders route', async () => {
    await orderRoutes(server);
    expect(server.get).toHaveBeenCalledWith('/orders', expect.any(Function));
  });

  // Adicione mais testes conforme necessário
});