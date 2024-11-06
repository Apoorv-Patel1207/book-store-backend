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
  newItem.quantity = newItem.quantity || 1;

  const existingItem = cart.find((item) => item.id === newItem.id);
  if (existingItem) {
    existingItem.quantity += newItem.quantity;
  } else {
    cart.push(newItem);
  }

  writeCartToFile(cart);
  res.status(201).json(cart);
};

export const removeFromCart = (req: Request, res: Response) => {
  const cart = readCartFromFile();
  const itemId = parseInt(req.params.id);

  const itemIndex = cart.findIndex((item) => item.id === itemId);
  if (itemIndex !== -1) {
    const removedItem = cart.splice(itemIndex, 1);
    writeCartToFile(cart);
    res.json(removedItem);
  } else {
    res.status(404).send("Item not found in cart");
  }
};

export const clearCart = (req: Request, res: Response) => {
  writeCartToFile([]);
  res.sendStatus(204);
};

// export const updateCartQuantity = (req: Request, res: Response) => {
//   const cart = readCartFromFile();
//   const itemId = parseInt(req.params.id);
//   const { quantity } = req.body;

//   if (quantity <= 0) {
//     return res.status(400).send("Quantity must be greater than zero");
//   }

//   const item = cart.find((item) => item.id === itemId);

//   if (item) {
//     item.quantity = quantity;
//     writeCartToFile(cart);
//     res.json(item);
//   } else {
//     res.status(404).send("Item not found in cart");
//   }
// };

// export const updateCartQuantity = (
//   req: Request,
//   res: Response
// ): Response | void => {
//   const cart = readCartFromFile();
//   const itemId = parseInt(req.params.id);
//   const { quantity } = req.body;

//   if (quantity <= 0) {
//     return res.status(400).send("Quantity must be greater than zero");
//   }

//   const item = cart.find((item) => item.id === itemId);

//   if (item) {
//     item.quantity = quantity;
//     writeCartToFile(cart);
//     return res.json(item); 
//   } else {
//     return res.status(404).send("Item not found in cart");
//   }
// };

export const updateCartQuantity = (req: Request, res: Response): void => {
  const cart = readCartFromFile();
  const itemId = parseInt(req.params.id);
  const { quantity } = req.body;

  if (quantity <= 0) {
    res.status(400).send("Quantity must be greater than zero");
    return;
  }

  const item = cart.find((item) => item.id === itemId);
  if (item) {
    item.quantity = quantity;
    writeCartToFile(cart);
    res.json(item);
  } else {
    res.status(404).send("Item not found in cart");
  }
};
