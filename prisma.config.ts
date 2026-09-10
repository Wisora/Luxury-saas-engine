import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Prisma CLI (db push/migrate) requires the DIRECT_URL to modify tables
    url: env("DIRECT_URL"),
  },
});