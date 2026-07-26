import { PrismaClient } from "@prisma/client";

/**
 * Prisma client using the native connection (Rust query engine over TCP+SSL).
 *
 * We previously used the Neon WebSocket serverless adapter, but it failed on
 * Vercel with "Connection terminated unexpectedly" against the pooled endpoint.
 * The native connection is more reliable here. For Neon's pooled (PgBouncer)
 * endpoint we append `pgbouncer=true` so Prisma disables prepared statements,
 * which PgBouncer's transaction pooling doesn't support.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveDatasourceUrl(): string | undefined {
  let url = process.env.DATABASE_URL;
  if (!url) return undefined;
  const isPooled = url.includes("-pooler");
  if (isPooled && !/[?&]pgbouncer=/.test(url)) {
    url += (url.includes("?") ? "&" : "?") + "pgbouncer=true";
  }
  return url;
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    datasourceUrl: resolveDatasourceUrl(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
