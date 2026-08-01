import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * `prisma` is undefined when DATABASE_URL isn't set — constructing
 * PrismaClient without it throws immediately, which would crash the whole
 * app rather than let it run in demo mode. Every data-access function in
 * `src/lib/data/` checks for this and falls back to the mock dataset.
 */
export const prisma: PrismaClient | undefined = process.env.DATABASE_URL
  ? (globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    }))
  : undefined;

if (prisma && process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
