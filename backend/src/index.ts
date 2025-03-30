import "dotenv/config";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import authRoutes from "./routes/authRouter.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const supabaseUrl = process.env.DATABASE_URL!;
const supabaseKey = process.env.DATABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
