//cliant/components/CoffeeQuestionPicker.tsx

interface Props {
  onSelect: (q: string) => void;
  onClose: () => void;
}

const categories = [
  {
    title: "☕ BASICS",
    items: [
      "Favorite type of coffee",
      "Neighborhood you live in",
      "Favorite café in your area",
      "Morning or evening coffee person?",
      "Go-to pastry or snack with coffee",
    ],
  },
  {
    title: "💬 COFFEE PERSONALITY",
    items: [
      "Your usual coffee order",
      "Coffee & music combo",
      "Your coffee vibe",
      "Café you'd take a friend to",
      "Café you'd go on a date",
      "If your coffee style were a person, it would be...",
    ],
  },
  {
    title: "☁️ TASTE & ROAST PREFERENCES",
    items: [
      "Favorite coffee bean origin",
      "Roast preference",
    ],
  },
];

export default function CoffeeQuestionPicker({ onSelect, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-bgTransparentDark flex items-center justify-center z-[100]"
    >
      <div className="bg-[#FBFBED] w-[500px] h-[460px] rounded-base shadow-lg overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Choose a question</h2>
          <button onClick={onClose} className="text-xl font-bold">×</button>
        </div>

        {/* list */}
        {categories.map((cat, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-bold mb-2">{cat.title}</h3>
            <ul className="space-y-1">
              {cat.items.map((item, idx) => (
                <li
                  key={idx}
                  className="cursor-pointer hover:opacity-70"
                  onClick={() => onSelect(item)}
                >
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
