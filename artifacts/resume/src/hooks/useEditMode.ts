import { useState, useEffect, useCallback } from "react";

const EDIT_PASSWORD = "sasha2026";
const SESSION_KEY = "resume_edit_session";

export function useEditMode() {
  const [isEditing, setIsEditing] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  });
  const [showPrompt, setShowPrompt] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "E") {
        e.preventDefault();
        if (isEditing) {
          exitEdit();
        } else {
          setShowPrompt(true);
          setPasswordError(false);
        }
      }
      if (e.key === "Escape" && showPrompt) {
        setShowPrompt(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, showPrompt]);

  const tryEnterEdit = useCallback((password: string) => {
    if (password === EDIT_PASSWORD) {
      setIsEditing(true);
      sessionStorage.setItem(SESSION_KEY, "true");
      setShowPrompt(false);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }, []);

  const exitEdit = useCallback(() => {
    setIsEditing(false);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const openPrompt = useCallback(() => {
    setShowPrompt(true);
    setPasswordError(false);
  }, []);

  const closePrompt = useCallback(() => {
    setShowPrompt(false);
    setPasswordError(false);
  }, []);

  return { isEditing, showPrompt, passwordError, tryEnterEdit, exitEdit, openPrompt, closePrompt };
}
