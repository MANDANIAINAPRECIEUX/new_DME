export function getTodayAppointments(appointments) {
  const today = new Date().toISOString().split("T")[0];

  return appointments.filter(
    (appointment) => appointment.date === today
  );
}