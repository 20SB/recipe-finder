// src\config\db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "../models/schema";

// export const client = new Client({
//   host: process.env.HOST,
//   user: process.env.DBUSER,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
//   port: 5432,
//   ssl: false,
// });

console.log("Postgress URL : ", process.env.PG_URL);
export let client = new Client(process.env.PG_URL);

client
  .connect()
  .then(() => {
    console.log("Postgress Client is Connected Successfully");
  })
  .catch((err: any) => {
    console.error("Error connecting DB : ", err);
  });

const postgresdb = drizzle(client, { schema: { ...schema } });

export default postgresdb;

// Function to disconnect from the PostgreSQL database
export const disconnectDB = async () => {
  try {
    await client.end();
    console.log("Postgres Client has been disconnected successfully");
  } catch (err) {
    console.error("Error disconnecting DB: ", err);
  }
};
