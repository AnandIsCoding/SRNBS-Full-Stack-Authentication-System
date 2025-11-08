import chalk from "chalk"; 
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { StatusCodes } from "http-status-codes";

import connectToDb from "./configs/database.config.js";
import { PORT } from "./configs/server.config.js";
import authRouter from "./routes/auth.route.js";

const app = express();


// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// CORS Settings

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:7000",
  "https://srnbsauth.vercel.app",
  "https://srnbs-full-stack-authentication-sys.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow mobile/postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log(chalk.red(`❌ Blocked by CORS: ${origin}`));
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));


// Routes

app.use("/api/auth", authRouter);

// Root API Check
app.get("/", (_, res) =>
  res.status(200).json({ message: "Server is running!" })
);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(chalk.red("❌ Server Error:"), err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error!",
  });
});


// Start Server (Proper Async Flow)

async function startServer() {
  try {
    await connectToDb();
    console.log(
      chalk.bgMagenta("✅ Connected to MongoDB Database successfully")
    );

    app.listen(PORT, () => {
      console.log(
        chalk.bgGreenBright(`🚀 Server running at http://localhost:${PORT}`)
      );
    });

  } catch (error) {
    console.error(
      chalk.bgRed(`❌ Error connecting to MongoDB: ${error.message}`)
    );
    process.exit(1);
  }
}

startServer();

export default app;
