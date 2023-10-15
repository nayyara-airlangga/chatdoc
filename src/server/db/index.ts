import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env.mjs";
import * as schema from "./schema";

const connectionString = env.DATABASE_URL;
// const migrationDriver = postgres(connectionString, { max: 1 });
// await migrate(drizzle(migrationDriver, { schema }), {
//   migrationsFolder: "migrations",
// });

const mainDriver = postgres(connectionString, { max: 100 });
export const db = drizzle(mainDriver, { schema });
