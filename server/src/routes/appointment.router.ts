import express from "express";
import { httpCreateAppointment } from "../controllers/appointment.controller";

const appointmentRouter = express.Router();

export default appointmentRouter.post("/appointment", httpCreateAppointment);
