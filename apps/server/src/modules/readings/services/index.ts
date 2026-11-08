import type { createReadingDTO, updateReadingDTO } from "../../../types/reading.types.js";
import {
  createReadingForUser,
  deleteReadingForUser,
  getReadingById,
  listReadingsForUser,
  updateReadingForUser,
} from "../repositories/index.js";
import { createReadingSchema, updateReadingSchema } from "../validators/index.js";

export class READING_ERROR extends Error {
  constructor(message: string) {
    super(message);
    this.name = "READING_ERROR";
  }
}

export const createReadingService = async (data: createReadingDTO) => {
  const parsedData = createReadingSchema.parse(data);
  return createReadingForUser(parsedData);
};

export const updateReadingService = async (readingId: string, userId: string, data: updateReadingDTO) => {
  const parsedData = updateReadingSchema.parse(data) as updateReadingDTO;
  const safeData: updateReadingDTO = {};

  if (parsedData.readingDate !== undefined) safeData.readingDate = parsedData.readingDate;
  if (parsedData.slot !== undefined) safeData.slot = parsedData.slot;
  if (parsedData.value !== undefined) safeData.value = parsedData.value;

  return updateReadingForUser(readingId, userId, safeData);
};

export const listReadingsService = async (userId: string) => listReadingsForUser(userId);
export const getReadingService = async (userId: string, readingId: string) => getReadingById(userId, readingId);
export const deleteReadingService = async (readingId: string, userId: string) => deleteReadingForUser(readingId, userId);