//cliant/compornents/CoffeeQuestionRow.tsx

type Props = {
  label: string;
  value: string | null; // selected question
  answer: string;       // typed value
  disabled: boolean;
  onSelectClick: () => void;
  onAnswerChange: (v: string) => void;
};

export default function CoffeeQuestionRow({
  label,
  value,
  answer,
  disabled,
  onSelectClick,
  onAnswerChange,
}: Props) {
  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between">
        
        {/* QUESTION LABEL */}
        <span
          className={`text-text ${
            disabled ? "opacity-40" : ""
          }`}
        >
          {value ?? label}
        </span>

        {/* ▼ ICON */}
        <button
          onClick={disabled ? undefined : onSelectClick}
          className={`ml-3 text-text ${
            disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
          }`}
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
            className="
              ml-4
              w-56
              bg-transparent
              outline-none
              border-b
              border-gray-300
              placeholder-gray-400
              text-left
              caret-gray-700
              focus:border-text
            "
          />
        )}
      </div>

      {/* BOTTOM GRAY LINE */}
      <div className="w-full border-b border-gray-300 mt-2"></div>
    </div>
  );
}
