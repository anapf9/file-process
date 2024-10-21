import {
  Order,
  OrderBuilder,
  Product,
  ProductBuilder,
  UserOrder,
  UserOrderBuilder,
} from "../../../../src/domain/entities/OrderBuilder";

describe("ProductBuilder", () => {
  test("should create a Product with specified product_id and value", () => {
    const product: Product = new ProductBuilder()
      .setProductId(1)
      .setValue("100.00")
      .build();

    expect(product).toEqual({
      product_id: 1,
      value: "100.00",
    });
  });
});

describe("OrderBuilder", () => {
  test("should create an Order with specified order_id, total, date, and products", () => {
    const product1: Product = new ProductBuilder()
      .setProductId(1)
      .setValue("100.00")
      .build();
    const product2: Product = new ProductBuilder()
      .setProductId(2)
      .setValue("200.00")
      .build();

    const order: Order = new OrderBuilder()
      .setOrderId(1)
      .setTotal("300.00")
      .setDate(new Date("2023-10-01"))
      .addProducts([product1, product2])
      .build();

    expect(order).toEqual({
      order_id: 1,
      total: "300.00",
      date: new Date("2023-10-01"),
      products: [product1, product2],
    });
  });

  test("should allow adding multiple products to an Order", () => {
    const product1: Product = new ProductBuilder()
      .setProductId(1)
      .setValue("100.00")
      .build();
    const product2: Product = new ProductBuilder()
      .setProductId(2)
      .setValue("200.00")
      .build();

    const order: Order = new OrderBuilder()
      .setOrderId(1)
      .setTotal("300.00")
      .addProducts([product1, product2])
      .build();

    expect(order.products).toEqual([product1, product2]);
  });
});

describe("UserOrderBuilder", () => {
  test("should create a UserOrder with specified user_id, name, and orders", () => {
    const product1: Product = new ProductBuilder()
      .setProductId(1)
      .setValue("100.00")
      .build();
    const order: Order = new OrderBuilder()
      .setOrderId(1)
      .setTotal("300.00")
      .setDate(new Date("2023-10-01"))
      .addProduct(product1)
      .build();

    const userOrder: UserOrder = new UserOrderBuilder()
      .setUserId(1)
      .setName("John Doe")
      .addOrder(order)
      .build();

    expect(userOrder).toEqual({
      user_id: 1,
      name: "John Doe",
      orders: [order],
    });
  });

  test("should allow adding multiple orders to a UserOrder", () => {
    const product1: Product = new ProductBuilder()
      .setProductId(1)
      .setValue("100.00")
      .build();
    const order1: Order = new OrderBuilder()
      .setOrderId(1)
      .setTotal("300.00")
      .setDate(new Date("2023-10-01"))
      .addProduct(product1)
      .build();

    const product2: Product = new ProductBuilder()
      .setProductId(2)
      .setValue("200.00")
      .build();
    const order2: Order = new OrderBuilder()
      .setOrderId(2)
      .setTotal("400.00")
      .setDate(new Date("2023-10-02"))
      .addProduct(product2)
      .build();

    const userOrder: UserOrder = new UserOrderBuilder()
      .setUserId(1)
      .setName("John Doe")
      .addOrder(order1)
      .addOrder(order2)
      .build();

    expect(userOrder.orders).toEqual([order1, order2]);
  });
});
