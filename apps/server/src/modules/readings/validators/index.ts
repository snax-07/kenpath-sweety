import { z } from "zod";
import { slotEnum } from "../../../types/reading.types.js";

export const createReadingSchema = z.object({
  userId: z.string().min(1, "User is not provided"),
  readingDate: z.string().min(1, "Date is required"),
  slot: z.nativeEnum(slotEnum),
  value: z.number().int("Value must be a whole number").min(40, "Value must be between 40 and 600 mg/dL.").max(600, "Value must be between 40 and 600 mg/dL."),
});

export const updateReadingSchema = z.object({
  readingDate: z.string().min(1, "Date is required").optional(),
  slot: z.nativeEnum(slotEnum).optional(),
  value: z.number().int("Value must be a whole number").min(40, "Value must be between 40 and 600 mg/dL.").max(600, "Value must be between 40 and 600 mg/dL.").optional(),
});