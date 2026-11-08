"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createReading,
  deleteReading,
  listReadings,
  updateReading,
  type CreateReadingInput,
  type ReadingRecord,
  type UpdateReadingInput,
} from "@/features/readings/services/readings-api";

export function useReadings() {
  const [readings, setReadings] = useState<ReadingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReadings = useCallback(async () => {
    setLoading(true);
    const items = await listReadings();
    setReadings(items);
    setError(items.length ? null : "No readings available yet.");
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadReadings();
  }, [loadReadings]);

  const addReading = useCallback(async (input: CreateReadingInput) => {
    const result = await createReading(input);
    if (result) {
      setReadings((current) => [result, ...current]);
      setError(null);
    } else {
      setError("The reading service is unavailable right now.");
    }
    return result;
  }, []);

  const editReading = useCallback(async (id: string, input: UpdateReadingInput) => {
    const result = await updateReading(id, input);
    if (result) {
      setReadings((current) => current.map((entry) => (entry.id === id ? result : entry)));
      setError(null);
    } else {
      setError("Unable to update this reading right now.");
    }
    return result;
  }, []);

  const removeReading = useCallback(async (id: string) => {
    const deleted = await deleteReading(id);
    if (deleted) {
      setReadings((current) => current.filter((entry) => entry.id !== id));
      setError(null);
    } else {
      setError("Unable to delete this reading right now.");
    }
    return deleted;
  }, []);

  return { readings, loading, error, loadReadings, addReading, editReading, removeReading };
}
