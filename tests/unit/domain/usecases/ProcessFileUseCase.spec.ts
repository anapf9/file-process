import { mock } from "jest-mock-extended";
import { ProcessFileUseCase } from "../../../../src/domain/usecases/ProcessFileUseCase";
import { UserOrderDTO } from "../../../../src/application/services/file/FileService";
import {
  UserOrder,
  Order,
  Product,
} from "../../../../src/domain/entities/OrderBuilder";
import { MapperUserOrderApplicationToDomain } from "../../../../src/domain/mapper/MapperUserOrderApplicationToDomain";
import { OrderRepository } from "../../../../src/infrastructure/repository/OrderRepository";

describe("ProcessFileUseCase", () => {
  let processFileUseCase: ProcessFileUseCase;
  const mockOrderRepository = mock<OrderRepository>();

  beforeEach(() => {
    processFileUseCase = new ProcessFileUseCase(mockOrderRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const userOrderFixture: UserOrderDTO = {
    user_id: 1,
    name: "John Doe",
    order_id: 123,
    date: "2023-10-01",
    product_id: 1,
    value: "100.00",
  };

  const newUserOrder: UserOrder =
    MapperUserOrderApplicationToDomain.execute(userOrderFixture);

  test("should save a new user order if user does not exist", async () => {
    mockOrderRepository.findByUserId.mockResolvedValueOnce(null);

    await processFileUseCase.execute(userOrderFixture);

    expect(mockOrderRepository.findByUserId).toHaveBeenCalledWith(
      userOrderFixture.user_id
    );
    expect(mockOrderRepository.save).toHaveBeenCalledWith(newUserOrder);
  });

  test("should update an existing user order if user exists", async () => {
    const existingUserOrder: UserOrder = {
      user_id: 1,
      name: "John Doe",
      orders: [],
    };

    mockOrderRepository.findByUserId.mockResolvedValueOnce(existingUserOrder);

    await processFileUseCase.execute(userOrderFixture);

    expect(mockOrderRepository.findByUserId).toHaveBeenCalledWith(
      userOrderFixture.user_id
    );
    expect(mockOrderRepository.update).toHaveBeenCalled();
  });

  test("should add a new product to an existing order", async () => {
    const existingOrder: Order = {
      order_id: 123,
      total: "100.00",
      date: new Date("2023-10-01"),
      products: [],
    };

    const existingUserOrder: UserOrder = {
      user_id: 1,
      name: "John Doe",
      orders: [existingOrder],
    };

    mockOrderRepository.findByUserId.mockResolvedValueOnce(existingUserOrder);

    const userOrderToUpdateFixture: UserOrderDTO = {
      user_id: 1,
      name: "John Doe",
      order_id: 123,
      date: "2023-10-01",
      product_id: 1,
      value: "100.00",
    };

    await processFileUseCase.execute(userOrderToUpdateFixture);

    expect(mockOrderRepository.findByUserId).toHaveBeenCalledWith(
      userOrderFixture.user_id
    );
    expect(mockOrderRepository.save).not.toHaveBeenCalled();
    expect(mockOrderRepository.update).toHaveBeenCalledWith({
      user_id: 1,
      name: "John Doe",
      orders: [
        {
          order_id: 123,
          total: "200",
          date: new Date("2023-10-01T00:00:00.000Z"),
          products: [{ product_id: 1, value: "100.00" }],
        },
      ],
    });
  });

  test("should not add a product if it already exists in the order", async () => {
    const existingProduct: Product = {
      product_id: 1,
      value: "100.00",
    };

    const existingOrder: Order = {
      order_id: 123,
      total: "100.00",
      date: new Date("2023-10-01"),
      products: [existingProduct],
    };

    const existingUserOrder: UserOrder = {
      user_id: 1,
      name: "John Doe",
      orders: [existingOrder],
    };

    mockOrderRepository.findByUserId.mockResolvedValueOnce(existingUserOrder);

    await processFileUseCase.execute(userOrderFixture);

    expect(mockOrderRepository.findByUserId).toHaveBeenCalledWith(
      userOrderFixture.user_id
    );
    expect(mockOrderRepository.update).toHaveBeenCalled();
    expect(existingOrder.products.length).toBe(1);
  });

  test("should update the total of the order when adding a new product", async () => {
    const existingOrder: Order = {
      order_id: 123,
      total: "100.00",
      date: new Date("2023-10-01"),
      products: [
        {
          product_id: 2,
          value: "100.00",
        },
      ],
    };

    const existingUserOrder: UserOrder = {
      user_id: 1,
      name: "John Doe",
      orders: [existingOrder],
    };

    mockOrderRepository.findByUserId.mockResolvedValueOnce(existingUserOrder);

    await processFileUseCase.execute(userOrderFixture);

    expect(mockOrderRepository.findByUserId).toHaveBeenCalledWith(
      userOrderFixture.user_id
    );
    expect(mockOrderRepository.update).toHaveBeenCalledWith({
      user_id: 1,
      name: "John Doe",
      orders: [
        {
          order_id: 123,
          total: "200",
          date: new Date("2023-10-01T00:00:00.000Z"),
          products: [
            { product_id: 2, value: "100.00" },
            { product_id: 1, value: "100.00" },
          ],
        },
      ],
    });
  });

  test("should log and throw an error if processing fails", async () => {
    const error = new Error("Test error");
    mockOrderRepository.findByUserId.mockRejectedValueOnce(error);

    await expect(processFileUseCase.execute(userOrderFixture)).rejects.toThrow(
      error
    );
    expect(mockOrderRepository.findByUserId).toHaveBeenCalledWith(
      userOrderFixture.user_id
    );
  });
});
