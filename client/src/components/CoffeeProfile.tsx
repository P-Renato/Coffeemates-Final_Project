import React, { useState, useEffect } from 'react';
import styles from './coffeeProfile.module.css';
import CoffeeQuestionRow from './CoffeeQuestionRow';
import CoffeeQuestionPicker from './CoffeeQuestionPicker';

interface CoffeeProfileProps {
  questionOptions?: string[];
  initialRows?: Array<{question: string | null, answer: string}>;
  onRowsChange: (rows: Array<{question: string | null, answer: string}>) => void;
}

const CoffeeProfile: React.FC<CoffeeProfileProps> = ({
  questionOptions = [],
  initialRows = [],
  onRowsChange
}) => {
  // Use questionOptions from backend OR hardcoded list as fallback
  const allQuestions = questionOptions.length > 0 
    ? questionOptions 
    : [
        "What's your favorite type of coffee?",
        "What neighborhood do you live in?",
        "What's your favorite café in your area?",
        "Are you a morning or evening coffee person?",
        "What's your go-to pastry or snack with coffee?",
        "What's your usual coffee order?",
        "What's your perfect coffee & music combo?",
        "How would you describe your coffee vibe?",
        "What café would you take a friend to?",
        "What café would you go to on a date?",
        "If your coffee style were a person, who would it be?",
        "What's your favorite coffee bean origin?",
        "What's your roast preference?",
        "What's your favorite brewing method?",
        "What's your milk of choice?",
        "Do you add sugar or syrup?",
        "What does coffee mean to you?",
        "What's your best coffee memory?",
        "Who is your ideal coffee mate?",
        "If you owned a café, what would it be like?",
        "What café do you dream of visiting one day?",
      ];
      console.log(allQuestions)


  // Initialize rows - FIRST ROW is always the default question
  const [rows, setRows] = useState<Array<{
    id: number;
    label: string;
    value: string | null;
    answer: string;
  }>>(() => {
    const defaultQuestion = "What's your favorite type of coffee?";
    
    // Start with the default question as first row
    const defaultRow = {
      id: 1,
      label: defaultQuestion,
      value: defaultQuestion,
      answer: ""
    };
    
    // If we have existing data from backend, add it AFTER the default row
    const existingRows = initialRows
      .filter(row => row.question && row.question !== defaultQuestion) // Don't duplicate default
      .map((row, index) => ({
        id: index + 2, // Start IDs from 2
        label: row.question || `Question ${index + 2}`,
        value: row.question,
        answer: row.answer || ''
      }));
    
    return [defaultRow, ...existingRows];
  });

  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [localShowPicker, setLocalShowPicker] = useState(false);

  // Notify parent when rows change
  useEffect(() => {
    const formattedRows = rows.map(row => ({
      question: row.value,
      answer: row.answer
    }));
    onRowsChange(formattedRows);
  }, [rows, onRowsChange]);

  const handleSelectClick = (rowId: number) => {
    setEditingRowId(rowId);
    setLocalShowPicker(true);
  };

  const handleQuestionSelect = (selectedQuestion: string) => {
    if (editingRowId !== null) {
      // Check if this question is already in use
      const isAlreadyUsed = rows.some(row => row.value === selectedQuestion);
      
      if (isAlreadyUsed) {
        // Don't add duplicate, just close the picker
        setEditingRowId(null);
        setLocalShowPicker(false);
        return;
      }
      
      // Find the position to insert the new row (after the row that was clicked)
      const clickedRowIndex = rows.findIndex(row => row.id === editingRowId);
      
      if (clickedRowIndex !== -1) {
        // Create new row with the selected question
        const newRowId = Math.max(...rows.map(r => r.id)) + 1;
        const newRow = {
          id: newRowId,
          label: selectedQuestion,
          value: selectedQuestion,
          answer: ""
        };
        
        // Insert the new row AFTER the clicked row
        const newRows = [...rows];
        newRows.splice(clickedRowIndex + 1, 0, newRow);
        
        setRows(newRows);
      }
      
      setEditingRowId(null);
      setLocalShowPicker(false);
    }
  };

  const handleAnswerChange = (rowId: number, value: string) => {
    setRows(prev => prev.map(row => 
      row.id === rowId ? { ...row, answer: value } : row
    ));
  };

  const handleRemoveRow = (rowId: number) => {
    // Don't allow removing the first row (default question)
    if (rowId !== 1 && rows.length > 1) {
      setRows(prev => prev.filter(row => row.id !== rowId));
    }
  };

  const handleClosePicker = () => {
    setEditingRowId(null);
    setLocalShowPicker(false);
  };

  // Get questions that are already in use
  const usedQuestions = rows.map(row => row.value).filter(Boolean) as string[];

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Coffee profile</h2>
      <div className={styles.subtitle}>
        Share your coffee preferences. Click the ▼ to add more questions.
      </div>

      <div className={styles.rowsContainer}>
        {rows.map((row) => (
          <div key={row.id} className={styles.rowWrapper}>
            <CoffeeQuestionRow
              label={row.label}
              value={row.value}
              answer={row.answer}
              disabled={false}
              onSelectClick={() => handleSelectClick(row.id)}
              onAnswerChange={(value) => handleAnswerChange(row.id, value)}
              styles={styles}
            />
            
            {/* Remove button - don't show for first row (default question) */}
            {row.id !== 1 && (
              <button 
                className={styles.removeButton}
                onClick={() => handleRemoveRow(row.id)}
                title="Remove this question"
                type="button"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Coffee Question Picker Modal */}
      {localShowPicker && (
        <CoffeeQuestionPicker
          onSelect={handleQuestionSelect}
          onClose={handleClosePicker}
          styles={styles}
          usedQuestions={usedQuestions}
        />
      )}
    </div>
  );
};

export default CoffeeProfile;