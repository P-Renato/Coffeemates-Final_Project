//criant/compornents/CoffeeProfile.tsx
import CoffeeQuestionRow from "./CoffeeQuestionRow";
import CoffeeQuestionPicker from "./CoffeeQuestionPicker";

type Props = {
  labels: string[];
  questions: (string | null)[];
  answers: string[];
  showPicker: boolean;
  activeIndex: number | null;
  isEnabled: (i: number) => boolean;
  openPicker: (i: number) => void;
  selectQuestion: (q: string) => void;
  closePicker: () => void;
  setAnswer: (i: number, v: string) => void;
};

export default function CoffeeProfile({
  labels,
  questions,
  answers,
  showPicker,
  activeIndex,
  isEnabled,
  openPicker,
  selectQuestion,
  closePicker,
  setAnswer,
}: Props) {
  return (
    <div className="mt-10 w-full">
      <h2 className="text-2xl font-bold mb-3">
        Coffee profile
        <span className="ml-2 text-sm text-gray-600">
          Tell us up to five things you love about coffee.
        </span>
      </h2>

      {/* rows */}
      {labels.map((label, i) => (
        <CoffeeQuestionRow
          key={i}
          label={label}
          value={questions[i]}
          answer={answers[i]}
          disabled={!isEnabled(i)}
          onSelectClick={() => openPicker(i)}
          onAnswerChange={(v) => setAnswer(i, v)}
        />
      ))}

      {/* picker modal */}
      {showPicker && (
        <CoffeeQuestionPicker
          onSelect={selectQuestion}
          onClose={closePicker}
        />
      )}
    </div>
  );
}
