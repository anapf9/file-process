export interface Product {
  product_id: number;
  value: string;
}

export interface Order {
  order_id: number;
  total: string;
  date: Date;
  products: Product[];
}

export interface UserOrder {
  user_id: number;
  name: string;
  orders: Order[];
}

export class ProductBuilder {
  private readonly product: Product;

  constructor() {
    this.product = { product_id: 0, value: "" };
  }

  setProductId(product_id: number): this {
    this.product.product_id = product_id;
    return this;
  }

  setValue(value: string): this {
    this.product.value = value;
    return this;
  }

  build(): Product {
    return this.product;
  }
}

export class OrderBuilder {
  private readonly order: Order;

  constructor() {
    this.order = { order_id: 0, total: "", date: new Date(), products: [] };
  }

  setOrderId(order_id: number): this {
    this.order.order_id = order_id;
    return this;
  }

  setTotal(total: string): this {
    this.order.total = total;
    return this;
  }

  setDate(date: Date): this {
    this.order.date = date;
    return this;
  }

  addProduct(product: Product): this {
    this.order.products.push(product);
    return this;
  }

  addProducts(products: Product[]): this {
    this.order.products = products;
    return this;
  }

  build(): Order {
    return this.order;
  }
}

export class UserOrderBuilder {
  private readonly userOrder: UserOrder;

  constructor() {
    this.userOrder = { user_id: 0, name: "", orders: [] };
  }

  setUserId(user_id: number): this {
    this.userOrder.user_id = user_id;
    return this;
  }

  setName(name: string): this {
    this.userOrder.name = name;
    return this;
  }

  getName(): this {
    this.userOrder.name;
    return this;
  }

  getUserId(): this {
    this.userOrder.user_id;
    return this;
  }

  addOrder(order: Order): this {
    this.userOrder.orders.push(order);
    return this;
  }

  build(): UserOrder {
    return this.userOrder;
  }
}