export function formatDate(dateStr, options = { day: "2-digit", month: "long", year: "numeric" }) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", options);
}