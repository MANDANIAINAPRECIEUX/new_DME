import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ quiet: true });

const source = process.env.DATABASE_URL;

if (!source) {
  throw new Error("DATABASE_URL manquante.");
}

const url = new URL(source);

if (
  !["127.0.0.1", "localhost"].includes(url.hostname) ||
  url.pathname !== "/cabinet_dentaire_dev"
) {
  throw new Error("Sécurité : la base source locale est inattendue.");
}

const databaseName = "new_dme_test";

const client = new pg.Client({
  connectionString: source,
});

try {
  await client.connect();

  const result = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [databaseName],
  );

  if (result.rowCount > 0) {
    console.log("La base new_dme_test existe déjà.");
  } else {
    await client.query('CREATE DATABASE "new_dme_test"');
    console.log("Base new_dme_test créée.");
  }
} catch (error) {
  console.error("Erreur PostgreSQL :", error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
