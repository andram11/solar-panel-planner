
import winston from 'winston';
import { PrismaClient } from '@prisma/client';

import { PrismaTransport} from '../config/PrismaTransportLog';

const prisma= new PrismaClient()

const logger = winston.createLogger({
    //will capture level info and above
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    //console by default
    new winston.transports.Console(),
    //record everything in db
    new PrismaTransport({
        prisma,
    })
  ],
});

export default logger;
