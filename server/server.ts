import express, { Request, Response } from "express";
import { errorMiddleware } from "./src/middleware/errorMiddleware";
import logger from "./src/utils/logger";
import cors from "cors";
import dotenv from "dotenv";

//Routes
import addressSearchRouter from "./src/routes/addressSearch.router";
import addressReferenceRouter from "./src/routes/addressReference.router";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

//Logging requests middleware - Before routes
app.use((req: Request, res: Response, next) => {
  logger.info({
    body: req.body,
    params: req.params,
    query: req.query,
  });
  next();
});

//Routes
app.use(addressSearchRouter);
app.use(addressReferenceRouter);

//Error middleware - After all routes
app.use(errorMiddleware);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;
