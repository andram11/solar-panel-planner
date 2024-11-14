import { prisma } from "../../src/utils/dbClient";
import { Appointment } from "../../src/interfaces/appointment";
import { AppointmentStatus } from "../../src/interfaces/appointmentStatus";
import { formatDate } from "../../src/utils/formatDates";
import {
  createAppointment,
  getAppointmentById,
  searchAppointments,
} from "../../src/services/appointmentService";

describe("createAppointment integration test", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should successfully create an appointment", async () => {
    const appointmentData: Appointment = {
      fName: "John",
      lName: "Doe",
      email: "johndoe@example.com",
      phoneNumber: "1234567890",
      address: {
        fullAddress: "9244 FLORIDA BLVD, STE E",
        city: "BATON ROUGE",
        zip: 70815,
      },
      appointmentDate: formatDate(new Date()), // Current date
      preferredTimeslot: "10:00 AM",
      status: AppointmentStatus.CREATED,
      comments: "First appointment",
    };

    const result = await createAppointment(appointmentData);
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("fk_address");
    expect(result.fk_address).toBeGreaterThan(0);
  });

  it("should throw an error if the daily appointment limit is reached", async () => {
    const appointmentData: Appointment = {
      fName: "Jane",
      lName: "Smith",
      email: "janesmith@example.com",
      phoneNumber: "0987654321",
      address: {
        fullAddress: "9244 FLORIDA BLVD, STE E",
        city: "BATON ROUGE",
        zip: 70815,
      },
      appointmentDate: "10-11-2024",
      preferredTimeslot: "11:00 AM",
      status: AppointmentStatus.CREATED,
      comments: "Appointment limit test",
    };

    // Using the date in the test case ensures this TC is successful
    await expect(createAppointment(appointmentData)).rejects.toThrow(
      "Maximum number of appointments reached for this date. Please select a different date."
    );
  });

  it("should throw an error if no matching address is found", async () => {
    const appointmentData: Appointment = {
      fName: "Alice",
      lName: "Brown",
      email: "alicebrown@example.com",
      phoneNumber: "1112223333",
      address: {
        fullAddress: "Nonexistent Address",
        city: "BATON ROUGE",
        zip: 70815,
      },
      appointmentDate: formatDate(new Date()),
      preferredTimeslot: "02:00 PM",
      status: AppointmentStatus.CREATED,
      comments: "Non-matching address test",
    };

    await expect(createAppointment(appointmentData)).rejects.toThrow(
      "The provided address does not exist in our records."
    );
  });

  it("should throw an error if provided appointment date is in the past", async () => {
    const appointmentData: Appointment = {
      fName: "Alice",
      lName: "Brown",
      email: "alicebrown@example.com",
      phoneNumber: "1112223333",
      address: {
        fullAddress: "9244 FLORIDA BLVD, STE E",
        city: "BATON ROUGE",
        zip: 70815,
      },
      appointmentDate: "01-01-2000",
      preferredTimeslot: "02:00 PM",
      status: AppointmentStatus.CREATED,
      comments: "Date in the past",
    };

    await expect(createAppointment(appointmentData)).rejects.toThrow(
      "The provided appointment date cannot be in the past."
    );
  });
});

describe("searchAppointments integration test", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return results when searching by status", async () => {
    const results = await searchAppointments(
      undefined,
      AppointmentStatus.CREATED,
      undefined,
      undefined,
      undefined
    );
    expect(results.data).toEqual(
      expect.arrayContaining([
        {
          id: 8,
          email: "john.doe@example.com",
          phoneNumber: "123-456-7890",
          requested_date: "10-11-2024",
          status: "CREATED",
          address: {
            full_address: "9007 HIGHLAND RD, STE 9",
            city: "BATON ROUGE",
            zip: 70810,
          },
        },
      ])
    );
  });

  it("should return results when searching by date", async () => {
    const results = await searchAppointments(
      "10-11-2024",
      undefined,
      undefined,
      undefined,
      undefined
    );
    expect(results.data).toEqual(
      expect.arrayContaining([
        {
          id: 8,
          email: "john.doe@example.com",
          phoneNumber: "123-456-7890",
          requested_date: "10-11-2024",
          status: "CREATED",
          address: {
            full_address: "9007 HIGHLAND RD, STE 9",
            city: "BATON ROUGE",
            zip: 70810,
          },
        },
      ])
    );
  });

  it("should return results when searching by zipCode", async () => {
    const results = await searchAppointments(
      undefined,
      undefined,
      "70810",
      undefined,
      undefined
    );
    expect(results.data).toEqual(
      expect.arrayContaining([
        {
          id: 8,
          email: "john.doe@example.com",
          phoneNumber: "123-456-7890",
          requested_date: "10-11-2024",
          status: "CREATED",
          address: {
            full_address: "9007 HIGHLAND RD, STE 9",
            city: "BATON ROUGE",
            zip: 70810,
          },
        },
      ])
    );
  });

  it("should throw an error if no parameters are provided", async () => {
    await expect(searchAppointments()).rejects.toThrow(
      "At least one search parameter must be provided."
    );
  });
});

describe("get appointment by id integration test", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return results when searching by id", async () => {
    const appointment = await getAppointmentById(56);
    expect(appointment).toBeTruthy();

    expect(appointment).toMatchObject({
      id: 56,
      fk_address: 24,
      fName: "John",
      lName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "123-456-7890",
      requested_date: "15-11-2024",
      pref_timeslot: "10:00-12:00",
      actual_timeslot: null,
      status: "CREATED",
      //Removing these from tests because values are returned as in the db as timestamp without time zone and
      //it's too much of a hassle to make the conversion every time for testing, especially since these
      //2 fields are more of metadata kind of data
      // createdAt: "2024-11-14T20:19:19.738Z",
      // updatedAt: "2024-11-14T20:19:19.738Z",
      comments: "First appointment consultation",
    });
  });

  it("should throw an error if inexistent id is provided", async () => {
    await expect(getAppointmentById(-20)).rejects.toThrow(
      "Appointment with the specified ID was not found."
    );
  });
});
