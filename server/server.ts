import express, { Request, Response } from 'express';
import { errorMiddleware } from './src/middleware/errorMiddleware';
import logger from './src/utils/logger';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

//Logging requests middleware - Before routes
app.use((req,res, next)=> {
    logger.info({
        body: req.body,
        params: req.params,
        query: req.query
    })
    next()
})

//Error middleware - After all routes
app.use(errorMiddleware)

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
