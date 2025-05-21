import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://neondb_owner:npg_6VceBMqrSp3T@ep-little-bush-a40s2714-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
);
export const db = drizzle(sql, { schema });
