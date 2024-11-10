import { Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { CreateAppoitmentRequest } from "../interfaces/appointment";
import { createAppointment } from "../services/appointmentService";

export const httpCreateAppointment = async (
  req: CreateAppoitmentRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fName, lName, email, phoneNumber, appointmentDate } = req.body;
    //Check requested search parameters are provided
    if (!fName || !lName || !email || !phoneNumber || !appointmentDate) {
      throw new AppError("Missing required properties.", 400);
    }

    //Call appointment service with requested parameters
    const appointment = await createAppointment(req.body);

    res.status(201).json({ appointment });
  } catch (err) {
    next(err);
  }
};
