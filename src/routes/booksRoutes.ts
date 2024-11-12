import express from "express";
import {
  getBooks,
  getBookById,
  createBook,
  deleteBook,
  searchBooks,
} from "../controllers/booksController";

const router = express.Router();
router.get("/search-books", searchBooks);

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", createBook);
router.delete("/:id", deleteBook);

export default router;
