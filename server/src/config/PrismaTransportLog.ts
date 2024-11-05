import TransportStream from 'winston-transport';

import { PrismaClient } from '@prisma/client';

interface PrismaTransportOptions extends TransportStream.TransportStreamOptions {
  prisma: PrismaClient;
}

export class PrismaTransport extends TransportStream {
  private prisma: PrismaClient;

  constructor(options: PrismaTransportOptions) {
    super(options);
    this.prisma = options.prisma;
  }

  // Log function to insert into database
  async log(info: any, callback: () => void) {
    const { level, message, timestamp } = info;

    try {
      await this.prisma.applicationLog.create({
        data: {
          level,
          message,
          timestamp: timestamp || new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to log to database:', error);
    }

    callback(); // Required for winston to finish the log
  }
}
