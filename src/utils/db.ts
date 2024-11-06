import fs from "fs";
import path from "path";
import { Book } from "../models/book";
import { CartItem } from "../models/cart";
import { Order } from "../models/order";

const BOOKS_PATH = path.join(__dirname, "..", "data", "books.json");
const CART_PATH = path.join(__dirname, "..", "data", "cart.json");
const ORDERS_Path = path.join(__dirname, "..", "data", "orders.json");

export const readBooksFromFile = (): Book[] => {
  const data = fs.readFileSync(BOOKS_PATH, "utf8");
  return JSON.parse(data);
};

export const writeBooksToFile = (books: Book[]) => {
  fs.writeFileSync(BOOKS_PATH, JSON.stringify(books, null, 2));
};

export const readCartFromFile = (): CartItem[] => {
  const data = fs.existsSync(CART_PATH)
    ? fs.readFileSync(CART_PATH, "utf8")
    : "[]";
  return JSON.parse(data);
};

export const writeCartToFile = (cart: CartItem[]) => {
  fs.writeFileSync(CART_PATH, JSON.stringify(cart, null, 2));
};

export const readOrdersFromFile = (): Order[] => {
  const data = fs.readFileSync(ORDERS_Path, "utf-8");
  return JSON.parse(data);
};

export const writeOrdersToFile = (orders: Order[]) => {
  fs.writeFileSync(ORDERS_Path, JSON.stringify(orders, null, 2));
};
