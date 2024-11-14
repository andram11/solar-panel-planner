import express from "express";
import {
  httpCreateAppointment,
  httpGetAppointmentById,
  httpSearchAppointments,
} from "../controllers/appointment.controller";

const appointmentRouter = express.Router();

appointmentRouter.post("/appointment", httpCreateAppointment);
appointmentRouter.get("/appointment/search", httpSearchAppointments);
appointmentRouter.get("/appointment/:id", httpGetAppointmentById);

export default appointmentRouter;
