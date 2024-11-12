import { Request, Response } from "express";
import { readOrdersFromFile, writeOrdersToFile } from "../utils/db";
import { Order } from "../models/order";

export const createOrder = (req: Request, res: Response) => {
  const orders: Order[] = readOrdersFromFile();
  const newOrder: Order = req.body;

  newOrder.orderId = Date.now();
  newOrder.orderDate = new Date().toISOString().split("T")[0];
  newOrder.status = "Processing";

  orders.push(newOrder);
  writeOrdersToFile(orders);

  res.status(201).json(newOrder);
};

export const getOrders = (req: Request, res: Response) => {
  const orders = readOrdersFromFile();
  res.json(orders);
};

export const getOrderById = (req: Request, res: Response) => {
  const orders = readOrdersFromFile();
  const order = orders.find((o) => o.orderId === parseInt(req.params.id));

  if (order) {
    res.json(order);
  } else {
    res.status(404).send("Order not found");
  }
};

export const deleteOrder = (req: Request, res: Response) => {
  const orders = readOrdersFromFile();
  const orderId = parseInt(req.params.id);
  const orderIndex = orders.findIndex((o) => o.orderId === orderId);

  if (orderIndex !== -1) {
    orders.splice(orderIndex, 1);
    writeOrdersToFile(orders);
    res.status(204).send();
  } else {
    res.status(404).send("Order not found");
  }
};

// Update the status of an order
export const updateOrderStatus = (req: Request, res: Response) => {
  const orders: Order[] = readOrdersFromFile();
  const orderId = parseInt(req.params.id);
  const { status } = req.body;

  const order = orders.find((o) => o.orderId === orderId);

  if (order) {
    order.status = status;
    writeOrdersToFile(orders);
    res.json(order);
  } else {
    res.status(404).send("Order not found");
  }
};
