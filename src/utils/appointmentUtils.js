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

export function filterAppointmentsByPatient(
  appointments,
  patients,
  searchTerm
) {
  const search = searchTerm.toLowerCase().trim();

  if (!search) {
    return appointments;
  }

  return appointments.filter((appointment) => {
    const patient = patients.find(
      (patient) => patient.id === appointment.patientId
    );

    if (!patient) {
      return false;
    }

    const fullName =
      `${patient.firstName} ${patient.lastName}`.toLowerCase();

    return fullName.includes(search);
  });
}

export function filterAppointmentsByStatus(
  appointments,
  status
) {
  if (status === "all") {
    return appointments;
  }

  return appointments.filter(
    (appointment) => appointment.status === status
  );
}

export function filterAppointmentsByDate(
  appointments,
  dateFilter
) {
  if (dateFilter === "all") {
    return appointments;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const startOfWeek = new Date(today);
  const day = startOfWeek.getDay();
  const difference = day === 0 ? 6 : day - 1;

  startOfWeek.setDate(
    startOfWeek.getDate() - difference
  );

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(
    startOfWeek.getDate() + 7
  );

  return appointments.filter((appointment) => {
    const appointmentDate = new Date(
      `${appointment.date}T00:00:00`
    );

    switch (dateFilter) {
      case "today":
        return appointmentDate.getTime() === today.getTime();

      case "tomorrow":
        return appointmentDate.getTime() === tomorrow.getTime();

      case "week":
        return (
          appointmentDate >= startOfWeek &&
          appointmentDate < endOfWeek
        );

      case "upcoming":
        return appointmentDate >= today;

      case "past":
        return appointmentDate < today;

      default:
        return true;
    }
  });
}

export function getUpcomingAppointments(appointments, daysAhead = 7) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const limitDate = new Date(today);
  limitDate.setDate(limitDate.getDate() + daysAhead);

  return appointments
    .filter((appointment) => {
      const appointmentDate = new Date(`${appointment.date}T00:00:00`);
      return (
        appointmentDate > today &&
        appointmentDate <= limitDate &&
        appointment.status !== "cancelled"
      );
    })
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
}