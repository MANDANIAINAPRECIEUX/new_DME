import test from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_API_URL ?? "http://localhost:3000";

const TOKEN = process.env.TEST_CLERK_TOKEN;

async function api(path, options = {}) {
  const headers = {
    Accept: "application/json",
    ...options.headers,
  };

  if (TOKEN) {
    headers.Authorization = `Bearer ${TOKEN}`;
  }

  const response = await fetch(`${BASE_URL}/api${path}`, {
    ...options,
    headers,
    signal: AbortSignal.timeout(10000),
  });

  const body = await response.json();

  return {
    status: response.status,
    body,
  };
}

// TEST 1 : serveur disponible
test("Health : serveur fonctionnel", async () => {
  const result = await api("/health");

  assert.equal(result.status, 200);
  assert.equal(result.body.status, "ok");
});

// TEST 2 : route inexistante
test("Route inexistante : 404", async () => {
  const result = await api("/route-qui-n-existe-pas");

  assert.equal(result.status, 404);
  assert.equal(result.body.error.code, "NOT_FOUND");
});

// TEST 3 : accès sans authentification
test("Clerk : accès non authentifié refusé", async () => {
  const response = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10000),
  });

  assert.equal(response.status, 401);
});

// TEST 4 : accès patients sans authentification
test("Patients : accès non autorisé", async () => {
  const response = await fetch(`${BASE_URL}/api/patients`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10000),
  });

  assert.equal(response.status, 401);
});

// TEST 5 : accès paiements sans authentification
test("Paiements : accès non autorisé", async () => {
  const response = await fetch(`${BASE_URL}/api/payments`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10000),
  });

  assert.equal(response.status, 401);
});

// TEST 6 : compte médecin authentifié
test("Médecin : profil accessible", { skip: !TOKEN }, async () => {
  const result = await api("/doctors/me");

  assert.equal(result.status, 200);
  assert.ok(result.body.doctor.id);
});

// TEST 7 : liste des traitements
test("Traitements : liste accessible", { skip: !TOKEN }, async () => {
  const result = await api("/treatments");

  assert.equal(result.status, 200);
  assert.ok(Array.isArray(result.body));
});

// TEST 8 : référentiel dentaire
test("Dents : 32 dents permanentes", { skip: !TOKEN }, async () => {
  const result = await api("/dents");

  assert.equal(result.status, 200);
  assert.equal(result.body.length, 32);

  const numbers = result.body.map((dent) => dent.number);

  assert.equal(new Set(numbers).size, 32);
});

// TEST 9 : Dashboard
test("Dashboard : statistiques accessibles", { skip: !TOKEN }, async () => {
  const result = await api("/dashboard/summary");

  assert.equal(result.status, 200);
  assert.ok(result.body.patients);
  assert.ok(result.body.appointments);
  assert.ok(result.body.payments);
});
