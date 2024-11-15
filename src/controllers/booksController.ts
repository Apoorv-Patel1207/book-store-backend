import { Request, Response } from "express";
import {
  readBooksFromFile,
  readPendingBooksFromFile,
  writeBooksToFile,
  writePendingBooksToFile,
} from "../utils/db";
import { Book } from "../models/book";

export const getBooks = (req: Request, res: Response) => {
  const books = readBooksFromFile();

  // Extract query parameters for filtering and searching
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const searchQuery = (req.query.searchQuery as string) || "";
  const filterGenre = (req.query.filterGenre as string) || "all";
  const priceMin = parseFloat(req.query.priceMin as string) || 0;
  const priceMax = parseFloat(req.query.priceMax as string) || 1000;

  // Apply search and filter logic
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      (book.title &&
        book.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (book.author &&
        book.author.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGenre = filterGenre === "all" || book.genre === filterGenre;
    const matchesPrice = book.price >= priceMin && book.price <= priceMax;
    return matchesSearch && matchesGenre && matchesPrice;
  });

  // Pagination
  const totalCount = filteredBooks.length; // Total number of filtered books
  const totalPages = Math.ceil(totalCount / limit); // Total number of pages

  // Ensure the page is within valid bounds
  const currentPage = Math.min(page, totalPages); // Clamp to the total number of pages
  const startIndex = (currentPage - 1) * limit;
  const endIndex = currentPage * limit;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

  // Return the paginated books along with metadata
  res.json({
    books: paginatedBooks,
    pagination: {
      totalCount,
      totalPages,
      currentPage,
      pageSize: limit,
    },
  });
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

export const updateBook = (req: Request, res: Response) => {
  const books = readBooksFromFile();
  const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id));

  if (bookIndex !== -1) {
    // Only update price and stockQuantity if they are provided in the request body
    const { price, stockQuantity } = req.body;

    const updatedBook: Book = {
      ...books[bookIndex],
      ...(price !== undefined && { price }),
      ...(stockQuantity !== undefined && { stockQuantity }),
    };

    books[bookIndex] = updatedBook;
    writeBooksToFile(books); // Save updated books to file

    res.json(updatedBook); // Respond with the updated book
  } else {
    res.status(404).send("Book not found");
  }
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

export const searchBooks = (req: Request, res: Response) => {
  const books = readBooksFromFile();
  const searchQuery = (req.query.searchQuery as string) || "";
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );
  res.json(filteredBooks);
};

// Fetch all pending books for admin review
export const getPendingBooks = (req: Request, res: Response) => {
  const pendingBooks = readPendingBooksFromFile();
  res.json(pendingBooks);
};

// Salesman adds a book as "pending"
export const addPendingBook = (req: Request, res: Response) => {
  const pendingBooks = readPendingBooksFromFile();
  const newBook: Book = {
    id: pendingBooks.length ? pendingBooks[pendingBooks.length - 1].id + 1 : 1,
    ...req.body,
    status: "pending",
  };
  pendingBooks.push(newBook);
  writePendingBooksToFile(pendingBooks);
  res.status(201).json(newBook);
};

export const approveBook = (req: Request, res: Response) => {
  const pendingBooks = readPendingBooksFromFile();
  const books = readBooksFromFile();
  const bookIndex = pendingBooks.findIndex(
    (b) => b.id === parseInt(req.params.id)
  );

  if (bookIndex !== -1) {
    // Cast the type to ensure `status` is compatible with `Book`
    const approvedBook: Book = {
      ...pendingBooks[bookIndex],
      status: "approved",
    };

    books.push(approvedBook); // Add to approved books
    pendingBooks.splice(bookIndex, 1); // Remove from pending books

    writeBooksToFile(books); // Save approved books
    writePendingBooksToFile(pendingBooks); // Update pending list

    res.json(approvedBook); // Respond with the approved book
  } else {
    res.status(404).send("Pending book not found");
  }
};

// Reject book
export const rejectBook = (req: Request, res: Response) => {
  const pendingBooks = readPendingBooksFromFile();
  const bookIndex = pendingBooks.findIndex(
    (b) => b.id === parseInt(req.params.id)
  );

  if (bookIndex !== -1) {
    const [rejectedBook] = pendingBooks.splice(bookIndex, 1);
    writePendingBooksToFile(pendingBooks);
    res.json({ message: "Book rejected", rejectedBook });
  } else {
    res.status(404).send("Pending book not found");
  }
};
