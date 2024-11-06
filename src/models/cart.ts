import { Book } from "./book";

export interface CartItem extends Book {
  quantity: number;
}
