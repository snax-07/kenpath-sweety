import type { Request, Response } from "express";
import { decodeHash } from "../../../utils/jwt.js";
import {
  createReadingService,
  deleteReadingService,
  getReadingService,
  listReadingsService,
  updateReadingService,
} from "../services/index.js";

const getCurrentUserId = async (req: Request) => {
  const request = req as Request & { cookies?: Record<string, string> };
  const token = request.cookies?.accessToken;
  if (!token) throw new Error("Unauthorized");

  const payload = (await decodeHash(token)) as { id?: string };
  if (!payload?.id) throw new Error("Unauthorized");

  return payload.id;
};

export const listReadingsController = async (req: Request, res: Response) => {
  try {
    const userId = await getCurrentUserId(req);
    const readings = await listReadingsService(userId);

    return res.status(200).json({
      message: "Readings fetched successfully",
      status: true,
      data: readings,
    });
  } catch (error) {
    return res.status(401).json({
      message: (error as Error).message || "Unauthorized",
      status: false,
      error,
    });
  }
};

export const createReadingController = async (req: Request, res: Response) => {
  try {
    const userId = await getCurrentUserId(req);
    const reading = await createReadingService({
      userId,
      readingDate: req.body.readingDate,
      slot: req.body.slot,
      value: Number(req.body.value),
    });

    return res.status(201).json({
      message: "Reading created successfully",
      status: true,
      data: reading,
    });
  } catch (error) {
    return res.status(400).json({
      message: (error as Error).message || "Unable to create reading",
      status: false,
      error,
    });
  }
};

export const getReadingController = async (req: Request, res: Response) => {
  try {
    const userId = await getCurrentUserId(req);
    const reading = await getReadingService(userId, String(req.params.id));

    if (!reading) {
      return res.status(404).json({ message: "Reading not found", status: false });
    }

    return res.status(200).json({
      message: "Reading fetched successfully",
      status: true,
      data: reading,
    });
  } catch (error) {
    return res.status(401).json({
      message: (error as Error).message || "Unauthorized",
      status: false,
      error,
    });
  }
};

export const updateReadingController = async (req: Request, res: Response) => {
  try {
    const userId = await getCurrentUserId(req);
    const reading = await updateReadingService(String(req.params.id), userId, {
      readingDate: req.body.readingDate,
      slot: req.body.slot,
      value: Number(req.body.value),
    });

    return res.status(200).json({
      message: "Reading updated successfully",
      status: true,
      data: reading,
    });
  } catch (error) {
    return res.status(400).json({
      message: (error as Error).message || "Unable to update reading",
      status: false,
      error,
    });
  }
};

export const deleteReadingController = async (req: Request, res: Response) => {
  try {
    const userId = await getCurrentUserId(req);
    await deleteReadingService(String(req.params.id), userId);

    return res.status(200).json({
      message: "Reading deleted successfully",
      status: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: (error as Error).message || "Unable to delete reading",
      status: false,
      error,
    });
  }
};
