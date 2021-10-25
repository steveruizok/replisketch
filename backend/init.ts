import { db } from "backend/db"

// Reset the database and create the necessary tables.

export async function initDb() {
  await db.task(async (t) => {
    // Remove any pre-existing tables
    await t.none("DROP TABLE IF EXISTS shape")
    await t.none("DROP TABLE IF EXISTS replicache_client")
    await t.none("DROP SEQUENCE IF EXISTS version")

    // Create a table "shape" to store shapes
    await t.none(`CREATE TABLE shape (
      id VARCHAR(21) PRIMARY KEY NOT NULL,
      shape JSON NOT NULL,
      deleted BOOLEAN NOT NULL,
      version BIGINT NOT NULL)`)

    // Create a table "replicache_client" to store the last mutation ID
    // for each Replicache client
    await t.none(`CREATE TABLE replicache_client (
      id VARCHAR(36) PRIMARY KEY NOT NULL,
      last_mutation_id BIGINT NOT NULL)`)

    // Create a sequence "version" to compute diffs for pull response
    await t.none("CREATE SEQUENCE version")
  })
}
