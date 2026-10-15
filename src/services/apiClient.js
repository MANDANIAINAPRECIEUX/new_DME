const API_BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiFetch(path, { token, ...options } = {}) {
  let res;

  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Impossible de joindre le serveur.");
  }

  if (res.status === 204) return null;

    const body = await res.json().catch(() => null);

  if (!res.ok) {
    const err = body?.error;

  // Certains endpoints renvoient les détails sous forme de simples chaînes
    const details = Array.isArray(err?.details)
      ? err.details.map((d) => (typeof d === "string" ? { message: d } : d))
      : undefined;

    throw new ApiError(
      res.status,
      err?.code ?? "UNKNOWN_ERROR",
      err?.message ?? `Erreur ${res.status}`,
      details
    );
  }
  return body;
}