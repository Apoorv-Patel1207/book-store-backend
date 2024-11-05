import { Request, Response } from "express";
import { readCartFromFile, writeCartToFile } from "../utils/db";
import { CartItem } from "../models/cart";

export const getCartItems = (req: Request, res: Response) => {
  const cart = readCartFromFile();
  res.json(cart);
};

export const addToCart = (req: Request, res: Response) => {
  const cart = readCartFromFile();
  const newItem: CartItem = req.body;

  // Check if item already exists in cart
  const existingItem = cart.find((item) => item.bookId === newItem.bookId);

  if (existingItem) {
    existingItem.quantity += newItem.quantity; // Update quantity
  } else {
    cart.push(newItem);
  }

  writeCartToFile(cart);
  res.status(201).json(newItem);
};

export const removeFromCart = (req: Request, res: Response) => {
  const cart = readCartFromFile();
  const itemId = parseInt(req.params.id);

  const itemIndex = cart.findIndex((item) => item.bookId === itemId);
  if (itemIndex !== -1) {
    const removedItem = cart.splice(itemIndex, 1);
    writeCartToFile(cart);
    res.json(removedItem);
  } else {
    res.status(404).send("Item not found in cart");
  }
};

export const clearCart = (req: Request, res: Response) => {
  writeCartToFile([]); // Clear cart by writing an empty array
  res.sendStatus(204); // No Content
};
