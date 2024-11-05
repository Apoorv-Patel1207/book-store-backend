import { Request, Response } from "express";
import { readBooksFromFile, writeBooksToFile } from "../utils/db";
import { Book } from "../models/book";

// export const getBooks = (req: Request, res: Response) => {
//   const books = readBooksFromFile();
//   res.json(books);
// };

export const getBooks = (req: Request, res: Response) => {
  const books = readBooksFromFile();
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedBooks = books.slice(startIndex, endIndex);
  res.json(paginatedBooks);
};

export const getBookById = (req: Request, res: Response) => {
  const books = readBooksFromFile();
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (book) {
    res.json(book);
  } else {
    res.status(404).send("Book not found");
  }
};

export const createBook = (req: Request, res: Response) => {
  const books = readBooksFromFile();
  const newBook: Book = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    ...req.body,
  };
  books.push(newBook);
  writeBooksToFile(books);
  res.status(201).json(newBook);
};

export const deleteBook = (req: Request, res: Response) => {
  const books = readBooksFromFile();
  const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (bookIndex !== -1) {
    const [deletedBook] = books.splice(bookIndex, 1);
    writeBooksToFile(books);
    res.json(deletedBook);
  } else {
    res.status(404).send("Book not found");
  }
};
