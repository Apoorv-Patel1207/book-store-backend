import express from "express";
import {
  getBooks,
  getBookById,
  createBook,
  deleteBook,
} from "../controllers/booksController";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", createBook);
router.delete("/:id", deleteBook);

export default router;
