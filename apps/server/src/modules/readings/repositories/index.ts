import { prisma } from "../../../config/post_db.js";
import type { createReadingDTO, updateReadingDTO } from "../../../types/reading.types.js";

const parseDateOnly = (value: string | Date) => {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);
  }

  const [yearValue, monthValue, dayValue] = String(value).split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    throw new Error("Invalid date value");
  }

  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

export async function listReadingsForUser(userId: string) {
  return prisma.reading.findMany({
    where: { userId },
    orderBy: [{ readingDate: "desc" }, { createdAt: "desc" }],
  });
}

export async function getReadingById(userId: string, readingId: string) {
  return prisma.reading.findFirst({
    where: { id: readingId, userId },
  });
}

export async function createReadingForUser(params: createReadingDTO) {
  const readingDate = parseDateOnly(params.readingDate);

  const alreadyExists = await prisma.reading.findFirst({
    where: {
      userId: params.userId,
      readingDate,
      slot: params.slot,
    },
  });

  if (alreadyExists) {
    throw new Error(`You already have a ${params.slot} reading for this date.`);
  }

  const sameDayCount = await prisma.reading.count({
    where: {
      userId: params.userId,
      readingDate,
    },
  });

  if (sameDayCount >= 4) {
    throw new Error("You can add only 4 readings per day.");
  }

  return prisma.reading.create({
    data: {
      userId: params.userId,
      readingDate,
      slot: params.slot,
      value: params.value,
    },
  });
}

export async function updateReadingForUser(readingId: string, userId: string, params: updateReadingDTO) {
  const existing = await prisma.reading.findFirst({ where: { id: readingId, userId } });
  if (!existing) throw new Error("Reading not found");

  const nextDate = params.readingDate ? parseDateOnly(params.readingDate) : existing.readingDate;
  const nextSlot = params.slot ?? existing.slot;
  const nextValue = params.value ?? existing.value;

  const duplicate = await prisma.reading.findFirst({
    where: {
      userId,
      readingDate: nextDate,
      slot: nextSlot,
      id: { not: readingId },
    },
  });

  if (duplicate) {
    throw new Error(`You already have a ${nextSlot} reading for this date.`);
  }

  return prisma.reading.update({
    where: { id: readingId },
    data: {
      readingDate: nextDate,
      slot: nextSlot,
      value: nextValue,
    },
  });
}

export async function deleteReadingForUser(readingId: string, userId: string) {
  const existing = await prisma.reading.findFirst({ where: { id: readingId, userId } });
  if (!existing) throw new Error("Reading not found");

  await prisma.reading.delete({ where: { id: readingId } });
  return existing;
}