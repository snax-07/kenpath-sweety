import type { Request, Response } from "express";
import { prisma } from "../../../config/post_db.js";
import { decodeHash } from "../../../utils/jwt.js";

const parseLocalDate = (dateString: string) => {
  const [yearValue, monthValue, dayValue] = dateString.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    throw new Error("Invalid date value");
  }

  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCurrentUserId = async (req: Request) => {
  const request = req as Request & { cookies?: Record<string, string> };
  const token = request.cookies?.accessToken;
  if (!token) throw new Error("Unauthorized");

  const payload = (await decodeHash(token)) as { id?: string };
  if (!payload?.id) throw new Error("Unauthorized");

  return payload.id;
};

const buildSummary = (readings: Array<{ value: number; readingDate: Date; slot: string }>, periodLabel: string) => {
  const values = readings.map((entry) => entry.value);
  const count = values.length;

  return {
    average: count ? Number((values.reduce((sum, value) => sum + value, 0) / count).toFixed(1)) : 0,
    highest: count ? Math.max(...values) : 0,
    lowest: count ? Math.min(...values) : 0,
    count,
    readings: readings.map((entry) => ({
      id: entry.slot,
      value: entry.value,
      slot: entry.slot,
      readingDate: formatLocalDate(entry.readingDate),
    })),
    periodLabel,
  };
};

export const getDailyReportController = async (req: Request, res: Response) => {
  try {
    const userId = await getCurrentUserId(req);
    const queryDate = req.query.date ? String(req.query.date) : formatLocalDate(new Date());
    const start = parseLocalDate(queryDate);
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 23, 59, 59, 999);

    const readings = await prisma.reading.findMany({
      where: { userId, readingDate: { gte: start, lte: end } },
      orderBy: { readingDate: "asc" },
    });

    return res.status(200).json({
      status: true,
      data: buildSummary(readings, queryDate),
    });
  } catch (error) {
    return res.status(401).json({ message: (error as Error).message || "Unauthorized", status: false });
  }
};

export const getRangeReportController = async (req: Request, res: Response) => {
  try {
    const userId = await getCurrentUserId(req);
    const startDate = req.query.from ? String(req.query.from) : formatLocalDate(new Date());
    const endDate = req.query.to ? String(req.query.to) : startDate;
    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);

    if (end < start) {
      return res.status(400).json({ message: "The start date must be before or equal to the end date.", status: false });
    }

    const readings = await prisma.reading.findMany({
      where: { userId, readingDate: { gte: start, lte: end } },
      orderBy: { readingDate: "asc" },
    });

    return res.status(200).json({
      status: true,
      data: buildSummary(readings, `${formatLocalDate(start)} – ${formatLocalDate(end)}`),
    });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message || "Unable to load report range", status: false });
  }
};

export const getMonthToDateReportController = async (req: Request, res: Response) => {
  try {
    const userId = await getCurrentUserId(req);
    const queryDate = req.query.date ? String(req.query.date) : formatLocalDate(new Date());
    const selected = parseLocalDate(queryDate);
    const start = new Date(selected.getFullYear(), selected.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 23, 59, 59, 999);

    const readings = await prisma.reading.findMany({
      where: { userId, readingDate: { gte: start, lte: end } },
      orderBy: { readingDate: "asc" },
    });

    return res.status(200).json({
      status: true,
      data: buildSummary(readings, `${formatLocalDate(start)} – ${formatLocalDate(end)}`),
    });
  } catch (error) {
    return res.status(401).json({ message: (error as Error).message || "Unauthorized", status: false });
  }
};

export const getPreviousMonthReportController = async (req: Request, res: Response) => {
  try {
    const userId = await getCurrentUserId(req);
    const queryDate = req.query.date ? String(req.query.date) : formatLocalDate(new Date());
    const selected = parseLocalDate(queryDate);
    const start = new Date(selected.getFullYear(), selected.getMonth() - 1, 1, 0, 0, 0, 0);
    const end = new Date(selected.getFullYear(), selected.getMonth(), 0, 23, 59, 59, 999);

    const readings = await prisma.reading.findMany({
      where: { userId, readingDate: { gte: start, lte: end } },
      orderBy: { readingDate: "asc" },
    });

    return res.status(200).json({
      status: true,
      data: buildSummary(readings, `${formatLocalDate(start)} – ${formatLocalDate(end)}`),
    });
  } catch (error) {
    return res.status(401).json({ message: (error as Error).message || "Unauthorized", status: false });
  }
};
