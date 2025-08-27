import React, { useState, useRef, useEffect } from 'react';
import style from './style.module.sass';

interface InlineEditorProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  placeholder?: string;
  className?: string;
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
  disabled?: boolean;
}

const InlineEditor: React.FC<InlineEditorProps> = ({
  value,
  onSave,
  placeholder = '',
  className = '',
  isEditing: externalIsEditing,
  onEditingChange,
  disabled = false
}) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use external editing state if provided, otherwise use internal state
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  const setIsEditing = onEditingChange || setInternalIsEditing;

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (!disabled && !isEditing) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (editValue.trim() === '') {
      setEditValue(value);
      setIsEditing(false);
      return;
    }

    if (editValue !== value) {
      setIsSaving(true);
      try {
        await onSave(editValue.trim());
      } catch (error) {
        console.error('Error saving:', error);
        setEditValue(value); // Revert on error
      } finally {
        setIsSaving(false);
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = () => {
    // Small delay to allow clicking save button
    setTimeout(() => {
      if (isEditing) {
        handleSave();
      }
    }, 150);
  };

  if (isEditing) {
    return (
      <div className={`${style.inlineEditor} ${style.editing} ${className}`}>
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={style.input}
          disabled={isSaving}
        />
        <div className={style.buttons}>
          <button
            type="button"
            onClick={handleSave}
            className={`${style.button} ${style.save}`}
            disabled={isSaving}
          >
            {isSaving ? '...' : '✓'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className={`${style.button} ${style.cancel}`}
            disabled={isSaving}
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <span
      onClick={handleClick}
      className={`${style.inlineEditor} ${style.display} ${className} ${disabled ? style.disabled : ''}`}
      title={disabled ? '' : 'Haz clic para editar'}
      data-placeholder={!value ? placeholder : ''}
    >
      {value}
      {!disabled && <span className={style.editIcon}>✏️</span>}
    </span>
  );
};

export default InlineEditor;
