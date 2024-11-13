import express from "express";
import { httpCreateAppointment, httpSearchAppointments } from "../controllers/appointment.controller";

const appointmentRouter = express.Router();

appointmentRouter.post("/appointment", httpCreateAppointment);
appointmentRouter.get("/appointment/search", httpSearchAppointments)

export default appointmentRouter
