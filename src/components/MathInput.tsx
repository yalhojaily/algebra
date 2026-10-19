import { useId } from 'react';
import { tryTex } from '../lib/expr';
import { Tex } from './MathText';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  allowEquation?: boolean;
  disabled?: boolean;
  label?: string;
}

/** A plain text box that shows a live, typeset preview of what the student is typing. */
export function MathInput({ value, onChange, onSubmit, placeholder, allowEquation, disabled, label = 'Your answer' }: Props) {
  const id = useId();
  const preview = value.trim() ? tryTex(value, allowEquation) : null;
  return (
    <div className="mi">
      <label htmlFor={id} className="mi-label">{label}</label>
      <div className="mi-row">
        <input
          id={id}
          className="mi-input"
          value={value}
          disabled={disabled}
          placeholder={placeholder ?? 'Type your answer'}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          inputMode="text"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
        <div className="mi-preview" aria-live="polite">
          {value.trim() === '' ? (
            <span className="mi-hint">preview</span>
          ) : preview ? (
            <Tex>{preview}</Tex>
          ) : (
            <span className="mi-hint">…</span>
          )}
        </div>
      </div>
      <div className="mi-help">
        Use <code>*</code> or just write <code>3x</code> for multiplication, <code>/</code> for division, <code>^</code> for powers.
      </div>
    </div>
  );
}
