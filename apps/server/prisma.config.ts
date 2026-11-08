
import dotenv from "dotenv";
import findConfig from "find-config";
import { definePrismaConfig } from "prisma/config";
import {
  defineConfig as definePostgresConfig,
  prisma7Schema,
} from "@prisma/orm-postgres/config";

const envPath = findConfig(".env") ?? findConfig(".env.example");
if (envPath) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const databaseUrl = process.env.DATABASE_URL;

export default definePrismaConfig({
  orm: definePostgresConfig({
    contract: prisma7Schema("prisma/schema.prisma"),
    output: "generated/prisma8",
    db: databaseUrl
      ? {
          connection: databaseUrl,
        }
      : {},
  }),
});
