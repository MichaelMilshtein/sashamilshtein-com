import { useRef, useEffect, KeyboardEvent, CSSProperties } from "react";

interface EditableTextProps {
  value: string;
  onChange: (val: string) => void;
  isEditing: boolean;
  className?: string;
  multiline?: boolean;
  style?: CSSProperties;
  tag?: string;
}

export function EditableText({
  value,
  onChange,
  isEditing,
  className = "",
  multiline = false,
  style,
  tag = "span",
}: EditableTextProps) {
  const ref = useRef<HTMLElement>(null);
  const latestValue = useRef(value);

  useEffect(() => {
    latestValue.current = value;
  }, [value]);

  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value, isEditing]);

  const handleBlur = () => {
    const newVal = ref.current?.textContent ?? "";
    if (newVal !== latestValue.current) {
      latestValue.current = newVal;
      onChange(newVal);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      ref.current?.blur();
    }
    if (e.key === "Escape") {
      if (ref.current) {
        ref.current.textContent = latestValue.current;
      }
      ref.current?.blur();
    }
  };

  const editStyle: CSSProperties = isEditing
    ? {
        borderBottom: "1px dashed rgba(139,92,246,0.5)",
        cursor: "text",
        outline: "none",
        minWidth: "2ch",
      }
    : {};

  const Tag = tag as keyof JSX.IntrinsicElements;

  return (
    <Tag
      // @ts-expect-error ref typing
      ref={ref}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onBlur={isEditing ? handleBlur : undefined}
      onKeyDown={isEditing ? handleKeyDown : undefined}
      className={className}
      style={{ ...style, ...editStyle }}
      spellCheck={isEditing}
      data-editable={isEditing ? "true" : undefined}
    >
      {value}
    </Tag>
  );
}
