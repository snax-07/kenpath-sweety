import { apiRequest } from "@/lib/api";

export type ReadingSlot = "MORNING" | "AFTER_BREAKFAST" | "AFTER_LUNCH" | "AFTER_DINNER";

export type ReadingRecord = {
  id: string;
  userId?: string;
  readingDate: string;
  slot: ReadingSlot;
  value: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateReadingInput = {
  readingDate: string;
  slot: ReadingSlot;
  value: number;
};

export type UpdateReadingInput = Partial<CreateReadingInput>;

const normalizeReadings = (payload: unknown): ReadingRecord[] => {
  if (Array.isArray(payload)) return payload as ReadingRecord[];
  if (payload && typeof payload === "object") {
    const record = payload as { data?: unknown; readings?: unknown };
    if (Array.isArray(record.data)) return record.data as ReadingRecord[];
    if (Array.isArray(record.readings)) return record.readings as ReadingRecord[];
  }
  return [];
};

export async function listReadings() {
  try {
    const result = await apiRequest<unknown>("/readings");
    return normalizeReadings(result);
  } catch {
    return [];
  }
}

export async function getReadingById(id: string) {
  try {
    const result = await apiRequest<unknown>(`/readings/${id}`);
    if (result && typeof result === "object") {
      const payload = result as { data?: unknown };
      return (payload.data ?? result) as ReadingRecord;
    }
    return null;
  } catch {
    return null;
  }
}

export async function createReading(input: CreateReadingInput) {
  try {
    const result = await apiRequest<unknown>("/readings", {
      method: "POST",
      body: JSON.stringify(input),
    });
    const payload = result && typeof result === "object" ? (result as { data?: unknown }).data ?? result : result;
    return (payload as ReadingRecord) ?? null;
  } catch {
    return null;
  }
}

export async function updateReading(id: string, input: UpdateReadingInput) {
  try {
    const result = await apiRequest<unknown>(`/readings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    const payload = result && typeof result === "object" ? (result as { data?: unknown }).data ?? result : result;
    return (payload as ReadingRecord) ?? null;
  } catch {
    return null;
  }
}

export async function deleteReading(id: string) {
  try {
    await apiRequest<unknown>(`/readings/${id}`, { method: "DELETE" });
    return true;
  } catch {
    return false;
  }
}
