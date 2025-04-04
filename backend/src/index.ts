import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { errorHandler } from "./middleware/errorMiddleware.js";

// Routes
import authRoutes from "./routes/authRouter.js";
import inventoryItemRoutes from "./routes/inventoryItemRouter.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/inventory-item", inventoryItemRoutes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
