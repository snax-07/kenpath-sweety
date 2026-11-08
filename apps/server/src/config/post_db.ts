
import dotenv from "dotenv";
import findConfig from "find-config";
import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";
import type { Contract } from "../../prisma/contract.d.ts";
import contractJson from "../../prisma/contract.json" with { type: "json" };

// Load environment variables
const envPath = findConfig(".env") || findConfig(".env.example");
dotenv.config(envPath ? { path: envPath } : undefined);

// Database connection
export const contract = contractFromJson<Contract>(contractJson);

export const db = postgres({
  contract,
  url: process.env.DATABASE_URL!,
});

const orm = (db as any).orm;

// Simple sorting function
function sortRows(rows: any[], orderBy: any) {
  if (!orderBy) return rows;

  const orders = Array.isArray(orderBy) ? orderBy : [orderBy];

  return [...rows].sort((a, b) => {
    for (const order of orders) {
      const field : any  = Object.keys(order)[0];
      const direction = order[field];

      if (a[field] === b[field]) continue;

      const result : any= a[field] > b[field] ? 1 : -1;

      if (result !== 0) {
        return direction === "desc" ? -result : result;
      }
    }

    return 0;
  });
}

// User operations
const userModel = {
  async findUnique({ where }: { where: { email?: string; id?: string } }) {
    if (where.email) {
      return orm.public.User.where({ email: where.email }).first();
    }

    if (where.id) {
      return orm.public.User.first({ id: where.id });
    }

    return null;
  },

  async create({ data }: { data: { name: string; email: string; passwordHash: string } }) {
    return orm.public.User.create(data);
  },
};

// Reading operations
const readingModel = {
  async findMany({ where, orderBy }: { where?: any; orderBy?: any }) {
    let query = orm.public.Reading;

    if (where?.userId) {
      query = query.where({ userId: where.userId });
    }

    if (where?.readingDate?.gte) {
      const date = new Date(where.readingDate.gte);
      query = query.where((row: any) => row.readingDate.gte(date));
    }

    if (where?.readingDate?.lte) {
      const date = new Date(where.readingDate.lte);
      query = query.where((row: any) => row.readingDate.lte(date));
    }

    const readings = await query.all();

    return orderBy ? sortRows(readings, orderBy) : readings;
  },

  async findFirst({ where }: { where: any }) {
    if (!where) return null;

    let query = orm.public.Reading;

    if (where.id) {
      if (typeof where.id === "string") {
        query = query.where({ id: where.id });
      } else if (where.id.not) {
        query = query.where((row: any) => row.id.neq(where.id.not));
      }
    }

    if (where.userId) {
      query = query.where({ userId: where.userId });
    }

    if (where.slot) {
      query = query.where({ slot: where.slot });
    }

    if (where.readingDate) {
      const date = new Date(where.readingDate);

      query = query
        .where((row: any) => row.readingDate.gte(date))
        .where((row: any) => row.readingDate.lte(date));
    }

    const readings = await query.all();

    return readings[0] || null;
  },

  async count({ where }: { where: any }) {
    const readings = await this.findMany({ where });
    return readings.length;
  },

  async create({
    data,
  }: {
    data: {
      userId: string;
      readingDate: Date | string;
      slot: string;
      value: number;
    };
  }) {
    return orm.public.Reading.create({
      userId: data.userId,
      readingDate: new Date(data.readingDate),
      slot: data.slot as "MORNING" | "AFTER_BREAKFAST" | "AFTER_LUNCH" | "AFTER_DINNER",
      value: data.value,
    });
  },

  async update({
    where,
    data,
  }: {
    where: { id: string };
    data: {
      readingDate?: Date | string;
      slot?: string;
      value?: number;
    };
  }) {
    const updateData: Record<string, unknown> = {};

    if (data.readingDate !== undefined) {
      updateData.readingDate = new Date(data.readingDate);
    }

    if (data.slot !== undefined) {
      updateData.slot = data.slot;
    }

    if (data.value !== undefined) {
      updateData.value = data.value;
    }

    return orm.public.Reading.where({ id: where.id }).update(updateData);
  },

  async delete({ where }: { where: { id: string } }) {
    const reading = await orm.public.Reading.where({ id: where.id }).first();

    if (!reading) return null;

    await orm.public.Reading.where({ id: where.id }).delete();

    return reading;
  },
};

// Export models
export const prisma = {
  user: userModel,
  reading: readingModel,
};
