import { Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { createPaginationResponse } from "../utils/pagination";

//Service imports
import {
  createAppointment,
  searchAppointments,
} from "../services/appointmentService";

//Interface imports
import { CreateAppoitmentRequest } from "../interfaces/appointment";
import { AppointmentSearchRequest } from "../interfaces/appointmentSearchRequest";
import { AppointmentStatus } from "../interfaces/appointmentStatus";

export const httpCreateAppointment = async (
  req: CreateAppoitmentRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fName, lName, email, phoneNumber, appointmentDate, address } =
      req.body;
    //Check requested search parameters are provided
    if (
      !fName ||
      !lName ||
      !email ||
      !phoneNumber ||
      !appointmentDate ||
      !address
    ) {
      throw new AppError("Missing required properties.", 400);
    }

    //Call appointment service with requested parameters
    const appointment = await createAppointment(req.body);

    res.status(201).json({ appointment });
  } catch (err) {
    next(err);
  }
};

export const httpSearchAppointments = async (
  req: AppointmentSearchRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, status, zipCode, pageNumber, pageSize } = req.query;
    //Check if at least one search parameter is present
    if (!date && !status && !zipCode) {
      throw new AppError(
        "At least one search parameter must be provided.",
        400
      );
    }

    // Map the status to AppointmentStatus enum
    const statusEnum =
      AppointmentStatus[
        status?.toUpperCase() as keyof typeof AppointmentStatus
      ] || null;

    //Call appointment service with the provided parameters
    const { totalItems, items: appointments } = await searchAppointments(
      date,
      statusEnum,
      zipCode,
      Number(pageNumber),
      Number(pageSize)
    );

    //Add pagination details
    //TO DO
    res
      .status(200)
      .json(
        createPaginationResponse(
          totalItems,
          Number(pageNumber) || 1,
          Number(pageSize || Number(process.env.PAGE_SIZE_APPOINTMENTS)),
          appointments
        )
      );
  } catch (err) {
    next(err);
  }
};
