import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Use DIRECT_URL for migrations and direct connections (port 5432)
// Use DATABASE_URL for connection pooling in production (port 6543)
const connectionString = process.env.DIRECT_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
    adapter,
    log: ["query"]
})