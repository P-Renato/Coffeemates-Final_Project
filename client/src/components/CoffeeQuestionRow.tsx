// client/components/CoffeeQuestionRow.tsx
import React from 'react';
import type coffeeProfileStyles from './coffeeProfile.module.css';

type CoffeeProfileClasses = typeof coffeeProfileStyles;

type Props = {
  label: string;
  value: string | null;
  answer: string;
  disabled: boolean;
  onSelectClick: () => void;
  onAnswerChange: (v: string) => void;
  styles: CoffeeProfileClasses; 
};

const CoffeeQuestionRow: React.FC<Props> = ({
  label,
  value,
  answer,
  disabled,
  onSelectClick,
  onAnswerChange,
  styles
}) => {
  if (!styles) {
    return <div>Error: Styles not loaded</div>;
  }
  return (
    <div className={styles.row}>
      <div className={styles.rowContent}>
        {/* QUESTION LABEL */}
        <span className={disabled ? styles.questionLabelDisabled : styles.questionLabel}>
          {value ?? label}
        </span>

        {/* ▼ ICON */}
        <button
          onClick={disabled ? undefined : onSelectClick}
          className={disabled ? styles.dropdownButtonDisabled : styles.dropdownButton}
          type="button"
          disabled={disabled}
        >
          ▼
        </button>

        {/* ANSWER FIELD */}
        {!disabled && value && (
          <input
            type="text"
            maxLength={50}
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Answer..."
            className={styles.answerInput}
          />
        )}
      </div>

      {/* BOTTOM GRAY LINE */}
      <div className={styles.divider} />
    </div>
  );
};

export default CoffeeQuestionRow;