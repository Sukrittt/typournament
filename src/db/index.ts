// import { connect } from "@planetscale/database";
// import { drizzle } from "drizzle-orm/planetscale-serverless";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

// import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

// create the connection
// const connection = connect({
//   url: process.env.DATABASE_URL,
// });
const client = postgres(process.env.DATABASE_URL);

export const db = drizzle(client);
