import { useState, useEffect, useCallback } from "react";
import { defaultResumeData, ResumeData } from "@/data/resumeData";

const STORAGE_KEY = "sasha_resume_data_v1";

function loadData(): ResumeData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultResumeData, ...JSON.parse(stored) };
    }
  } catch {}
  return defaultResumeData;
}

export function useResumeData() {
  const [data, setData] = useState<ResumeData>(loadData);

  const updateField = useCallback(<K extends keyof ResumeData>(
    field: K,
    value: ResumeData[K]
  ) => {
    setData((prev) => {
      const next = { ...prev, [field]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const updateNested = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    setData((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultResumeData);
  }, []);

  return { data, updateField, updateNested, resetToDefault };
}
