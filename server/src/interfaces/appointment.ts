import { AppointmentStatus } from "./appointmentStatus";
import { Request } from "express";

export interface CreateAppoitmentRequest extends Request {
  body: Appointment;
}

export interface Appointment {
  fName: string; // First name of the person
  lName: string; // Last name of the person
  email: string; // Email address
  address: AddressRequest;
  phoneNumber: string; // Contact number
  appointmentDate: Date; //DD-MM-YYYY format
  preferredTimeslot?: string; // Preferred time for the appointment
  readonly actualTimeslot: string; // Actual time assigned,is  updated later by the algorithm
  status: AppointmentStatus; // Status of the appointment, is updated later as well
  readonly createdAt: Date; // Timestamp when the appointment was created
  readonly updatedAt: Date; // Timestamp of the last update
  comments?: string; // Additional comments
}

export interface AddressRequest {
  fullAddress: string; // should be any combination of street name, number and any suffix type
  city: string;
  zip: number;
}
