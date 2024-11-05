import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import booksRoutes from "./routes/booksRoutes";
import cartRoutes from "./routes/cartRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/books", booksRoutes);
app.use("/api/cart", cartRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});