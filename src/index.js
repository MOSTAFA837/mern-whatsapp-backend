import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
import logger from "./config/logger.config.js";

dotenv.config();

// env vars
const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 8000;

// exit the server on mongodb error
mongoose.connection.on("error", (err) => {
  logger.error(`mongodb connection error : ${err}`);
  process.exit(1);
});

// mongodb connection
mongoose.connect(DATABASE_URL).then(() => {
  logger.info("Connected to mongodb.");
});

let server;

server = app.listen(PORT, () => {
  logger.info(`Server is running at port ${PORT}...`);
});

//handle server errors
const exitHandler = () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
