import { Appointment } from "../interfaces/appointment";
import { prisma } from "../utils/dbClient";
import { AppError } from "../utils/AppError";

export const createAppointment = async (appointment: Appointment) => {
  return await prisma.$transaction(async (tx: any) => {
    // Step 1: Check the current count of appointments for the given date
    const appointmentCounter = await tx.daily_Appointments_Counter.findUnique({
      where: { date: appointment.appointmentDate },
    });

    if (appointmentCounter && appointmentCounter.count >= 9) {
      throw new AppError(
        "Maximum number of appointments reached for this date. Please select a different date.",
        400
      );
    }

    // Step 2: Create the appointment
    const createdAppointment = await tx.appointments.create({
      data: {
        fName: appointment.fName,
        lName: appointment.lName,
        email: appointment.email,
        phoneNumber: appointment.phoneNumber,
        requested_date: appointment.appointmentDate,
        pref_timeslot: appointment.preferredTimeslot,
        status: appointment.status,
        comments: appointment.comments,
      },
    });

    // Step 3: Update the appointment counter
    if (appointmentCounter) {
      // Increment the existing counter
      await tx.dailyAppointmentsCounter.update({
        where: { date: appointment.appointmentDate },
        data: { count: { increment: 1 } },
      });
    } else {
      // Initialize the counter if it doesn't exist for this date
      await tx.appointmentCounter.create({
        data: { date: appointment.appointmentDate, count: 1 },
      });
    }

    return createdAppointment;
  });
};
