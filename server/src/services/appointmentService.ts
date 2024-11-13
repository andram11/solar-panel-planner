//Interfaces
import { Appointment } from "../interfaces/appointment";
import { AppointmentPreview } from "../interfaces/appointmentPreview";
import { AppointmentSearchRequest } from "../interfaces/appointmentSearchRequest";
//Other imports
import { prisma } from "../utils/dbClient";
import { AppError } from "../utils/AppError";
import { sanitizeText, validateZip } from "../utils/sanitizeInput";
import { formatDate } from "../utils/formatDates";
import dotenv from "dotenv";
import { AppointmentStatus } from "../interfaces/appointmentStatus";

dotenv.config();

const similarityThreshold = process.env.SIMILARITY_THRESHOLD;
const defaultPageSizeAppointments =
  Number(process.env.PAGE_SIZE_APPOINTMENTS) || 10;

export const createAppointment = async (appointment: Appointment) => {
  return await prisma.$transaction(async (tx: any) => {
    // Step 1: Check the current count of appointments for the given date
    const appointmentCounter = await tx.daily_Appointments_Counter.findUnique({
      where: { date: appointment.appointmentDate },
    });

    if (appointmentCounter && appointmentCounter.counter >= 9) {
      throw new AppError(
        "Maximum number of appointments reached for this date. Please select a different date.",
        400
      );
    }

    //Step 2: Check that the address exists in Address_Listing table and get the FK
    const { fullAddress, city, zip } = appointment.address;

    //Sanitize input since queryRawUnsafe bypasses the usual queryRaw protection against sql injection
    const sanitizedFullAddress = sanitizeText(fullAddress, "fullAddress");
    const sanitizedCity = sanitizeText(city, "city");
    const validatedZip = validateZip(zip);

    const query = `
      SELECT id, full_address, city, zip
      FROM planner."Address_listing"
      WHERE 
      city ILIKE CAST('${sanitizedCity}' AS TEXT)
        AND zip = ${validatedZip}
        AND public.similarity(CAST(full_address AS TEXT), CAST('${sanitizedFullAddress}' AS TEXT)) >= ${similarityThreshold}
      ORDER BY public.similarity(CAST(full_address AS TEXT), CAST('${sanitizedFullAddress}' AS TEXT)) DESC
    `;

    const matchedAddresses = await tx.$queryRawUnsafe(query);

    if (matchedAddresses.length === 0) {
      throw new AppError(
        "The provided address does not exist in our records.",
        404
      );
    }

    const fk_address = matchedAddresses[0].id;

    // Step 3: Create the appointment
    //check that appointmentDate is not in the past
    if (appointment.appointmentDate < formatDate(new Date())) {
      throw new AppError(
        "The provided appointment date cannot be in the past.",
        404
      );
    }
    const createdAppointment = await tx.appointments.create({
      data: {
        fName: appointment.fName,
        lName: appointment.lName,
        email: appointment.email,
        phoneNumber: appointment.phoneNumber,
        fk_address: fk_address,
        requested_date: appointment.appointmentDate,
        pref_timeslot: appointment.preferredTimeslot,
        status: appointment.status,
        comments: appointment.comments,
      },
    });

    // Step 4: Update the appointment counter
    if (appointmentCounter) {
      // Increment the existing counter
      await tx.daily_Appointments_Counter.update({
        where: { date: appointment.appointmentDate },
        data: { counter: { increment: 1 } },
      });
    } else {
      // Initialize the counter if it doesn't exist for this date
      await tx.daily_Appointments_Counter.create({
        data: { date: appointment.appointmentDate, counter: 1 },
      });
    }

    return createdAppointment;
  });
};

export const searchAppointments = async (
  date?: string,
  status?: AppointmentStatus,
  zipCode?: string,
  pageNumber?: number,
  pageSize?: number
) => {
  //All search parameters can be applied at once or at least one must be available
  const conditions: any = {};
  if (date) conditions.requested_date = { equals: date };
  if (status) conditions.status = { equals: status };
  if (zipCode) conditions.zip = { equals: zipCode };

  if (Object.keys(conditions).length === 0) {
    throw new Error("At least one search parameter must be provided.");
  }

  //Get the count of items for pagination
  const totalItems = await prisma.appointments.count({
    where: conditions,
  });

  //Get the items
  const items = await prisma.appointments.findMany({
    skip: (Number(pageNumber) - 1 || 0) * Number(pageSize) || 0,
    take: pageSize || defaultPageSizeAppointments,
    where: conditions,
    select: {
      id: true,
      email: true,
      phoneNumber: true,
      requested_date: true,
      status: true,
      address: {
        select: {
          full_address: true,
          city: true,
          zip: true,
        },
      },
    },
  });

  return { totalItems, items };
};
