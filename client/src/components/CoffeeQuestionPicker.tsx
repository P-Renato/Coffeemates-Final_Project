import React from 'react';
import type coffeeProfileStyles from './coffeeProfile.module.css';

type CoffeeProfileClasses = typeof coffeeProfileStyles;

interface Props {
  onSelect: (q: string) => void;
  onClose: () => void;
  styles: CoffeeProfileClasses;
  availableQuestions?: string[]; 
  usedQuestions?: string[]; 
}

const categories = [
  {
    title: "☕ BASICS",
    items: [
     "What's your favorite type of coffee?",
      "What neighborhood do you live in?",
      "What's your favorite café in your area?",
      "Are you a morning or evening coffee person?",
      "What's your go-to pastry or snack with coffee?",
    ],
  },
  {
    title: "💬 COFFEE PERSONALITY",
    items: [
      "What's your usual coffee order?",
      "What's your perfect coffee & music combo?",
      "How would you describe your coffee vibe?",
      "What café would you take a friend to?",
      "What café would you go to on a date?",
      "If your coffee style were a person, who would it be?",
    ],
  },
  {
    title: "☁️ TASTE & ROAST PREFERENCES",
    items: [
      "What's your favorite coffee bean origin?",
      "What's your roast preference?",
      "What's your favorite brewing method?",
      "What's your milk of choice?",
      "Do you add sugar or syrup?",
    ],
  },
  {
    title: "💫 VIBE & COMMUNITY",
    items: [
      "What does coffee mean to you?",
      "What's your best coffee memory?",
      "Who is your ideal coffee mate?",
      "If you owned a café, what would it be like?",
      "What café do you dream of visiting one day?",
    ],
  },
];

const CoffeeQuestionPicker: React.FC<Props> = ({ onSelect, onClose, styles, availableQuestions }) => {
  // If availableQuestions is provided, filter categories to show only available ones
  const filteredCategories = availableQuestions 
    ? categories.map(category => ({
        ...category,
        items: category.items.filter(item => availableQuestions.includes(item))
      })).filter(category => category.items.length > 0) // Remove empty categories
    : categories;

  return (
    <div className={styles.pickerOverlay}>
      <div className={styles.pickerContainer}>
        <div className={styles.pickerHeader}>
          <h2 className={styles.pickerTitle}>Choose a question</h2>
          <button onClick={onClose} className={styles.closeButton} type="button">×</button>
        </div>

        {/* Show message if no questions available */}
        {filteredCategories.length === 0 ? (
          <div className={styles.noQuestionsMessage}>
            You've answered all available questions!
          </div>
        ) : (
          /* List */
          filteredCategories.map((cat, i) => (
            <div key={i} className={styles.category}>
              <h3 className={styles.categoryTitle}>{cat.title}</h3>
              <ul className={styles.categoryList}>
                {cat.items.map((item, idx) => (
                  <li
                    key={idx}
                    className={styles.listItem}
                    onClick={() => onSelect(item)}
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CoffeeQuestionPicker;