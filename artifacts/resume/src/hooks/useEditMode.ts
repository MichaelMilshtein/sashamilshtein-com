import { useState, useCallback } from "react";

const SESSION_KEY = "resume_edit_session";

export function useEditMode() {
  const [isEditing, setIsEditing] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  });

  const enterEdit = useCallback(() => {
    setIsEditing(true);
    sessionStorage.setItem(SESSION_KEY, "true");
  }, []);

  const exitEdit = useCallback(() => {
    setIsEditing(false);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  return { isEditing, enterEdit, exitEdit };
}
