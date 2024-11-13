import { AppointmentStatus } from "./appointmentStatus";
import { Response } from "express";

export interface AppointmentPreview {
  id: number;
  email: string;
  phoneNumber: string; // Contact number
  appointmentDate: string; //DD-MM-YYYY format
  status: AppointmentStatus; // Status of the appointment
  address: string; //full address including city & zip
}
