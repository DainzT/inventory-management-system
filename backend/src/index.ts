import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import pino from "pino";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorMiddleware.js";

// Routes
import authRoutes from "./routes/authRouter.js";
import inventoryItemRoutes from "./routes/inventoryItemRouter.js";
import modifyItemRoutes from "./routes/modifyItemRouter.js";
import assignedItemRoutes from "./routes/assignedItemRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/inventory-item", inventoryItemRoutes);
app.use("/api/modify-item", modifyItemRoutes);
app.use("/api/assigned-item", assignedItemRoutes);
app.use(errorHandler);

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
});

app.listen(PORT, () => {
  logger.info(
    {
      event: "server_start",
      port: PORT,
      environment: process.env.NODE_ENV || "development",
      pid: process.pid,
    },
    `Server running in ${process.env.NODE_ENV || "development"} mode`
  );

  if (process.env.NODE_ENV !== "production") {
    logger.debug(`Database: ${process.env.DB_HOST}/${process.env.DB_NAME}`);
    logger.debug(`Debug logs enabled`);
    console.log(`\n➜ Local: http://localhost:${PORT}/api\n`);
  }
});
