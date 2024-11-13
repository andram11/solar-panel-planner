import { Request } from "express";

export interface AppointmentSearchRequest extends Request {
  query: {
    date?: string; //dd-mm-yyyy
    status?: string;
    zipCode?: string;
    pageNumber?: string;
    pageSize?: string;
  };
}
