import { useRef, useEffect, useState, FormEvent } from "react";

interface PasswordModalProps {
  onSubmit: (password: string) => void;
  onClose: () => void;
  hasError: boolean;
}

export function PasswordModal({ onSubmit, onClose, hasError }: PasswordModalProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "rgba(18,25,54,0.97)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "32px",
          width: "min(360px, 90vw)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ marginBottom: "8px", fontSize: "0.8rem", color: "#a5b0e6", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Edit Mode
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: "1.2rem", fontWeight: 700, color: "#eef2ff" }}>
          Enter your password
        </h2>
        <p style={{ margin: "0 0 20px", color: "#b8c0ea", fontSize: "0.9rem", lineHeight: 1.5 }}>
          This resume is view-only by default. Enter your password to unlock editing.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Password"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.06)",
              border: hasError ? "1px solid rgba(251,113,133,0.6)" : "1px solid rgba(255,255,255,0.12)",
              color: "#eef2ff",
              fontSize: "0.95rem",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
              marginBottom: "8px",
              transition: "border-color 0.2s",
            }}
          />
          {hasError && (
            <p style={{ margin: "0 0 12px", color: "#fb7185", fontSize: "0.85rem" }}>
              Incorrect password. Try again.
            </p>
          )}
          <div style={{ display: "flex", gap: "10px", marginTop: hasError ? "0" : "12px" }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(139,92,246,0.95), rgba(34,211,238,0.82))",
                border: "none",
                color: "white",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Unlock
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#b8c0ea",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
        <p style={{ marginTop: "16px", color: "#6b7280", fontSize: "0.78rem", textAlign: "center" }}>
          Tip: Ctrl+Shift+E to toggle edit mode
        </p>
      </div>
    </div>
  );
}
