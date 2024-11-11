export class AppError extends Error {
  public statusCode: number;
  public additionalData: any;

  constructor(message: string, statusCode: number, additionalData?:any) {
    super(message);
    this.statusCode = statusCode;
    this.additionalData= additionalData;
    Error.captureStackTrace(this, this.constructor);
  }
}
