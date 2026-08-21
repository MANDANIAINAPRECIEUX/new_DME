export function getTodayAppointments(appointments) {
  const today = new Date().toISOString().split("T")[0];

  return appointments.filter(
    (appointment) => appointment.date === today
  );
}

export const APPOINTMENT_DURATION = 15;

export const hasAppointmentConflict = (
  appointments,
  appointmentData,
  excludeAppointmentId = null
) => {
  const newStart =
    new Date(`${appointmentData.date}T${appointmentData.time}`).getTime();

  const newEnd =
    newStart + APPOINTMENT_DURATION * 60 * 1000;

  return appointments.some((appointment) => {
    if (
      excludeAppointmentId !== null &&
      appointment.id === Number(excludeAppointmentId)
    ) {
      return false;
    }

    if (appointment.status === "cancelled") {
      return false;
    }

    if (appointment.date !== appointmentData.date) {
      return false;
    }

    const appointmentStart =
      new Date(
        `${appointment.date}T${appointment.time}`
      ).getTime();

    const appointmentEnd =
      appointmentStart + APPOINTMENT_DURATION * 60 * 1000;

    return (
      newStart < appointmentEnd &&
      newEnd > appointmentStart
    );
  });
};