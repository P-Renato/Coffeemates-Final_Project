import React from 'react';

interface CoffeeProfileProps {
  labels: string[];
  questions: (string | null)[];
  answers: string[];
  showPicker: boolean;
  activeIndex: number | null;
  isEnabled: (index: number) => boolean;
  openPicker: (index: number) => void;
  selectQuestion: (question: string) => void;
  closePicker: () => void;
  setAnswer: (index: number, value: string) => void;
  questionOptions?: string[];
}

const CoffeeProfile: React.FC<CoffeeProfileProps> = ({
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
  questionOptions = []
}) => {
  return (
    <div className="coffee-profile-section">
      <h2 className="section-title">Coffee profile</h2>
      <div className="section-subtitle">
        Tell us up to five things you love about coffee.
      </div>

      <div className="coffee-profile-rows">
        {labels.map((label, index) => (
          <div
            key={index}
            className={`coffee-profile-row ${isEnabled(index) ? '' : 'disabled'}`}
          >
            <div className="row-label">{label}</div>
            
            <div className="row-content">
              <div className="question-selector">
                <div
                  className="question-display"
                  onClick={() => isEnabled(index) && openPicker(index)}
                >
                  {questions[index] || 'Select a question'}
                </div>
                
                {showPicker && activeIndex === index && (
                  <div className="question-picker">
                    <div className="picker-header">
                      <span>Choose a question</span>
                      <button onClick={closePicker} className="close-picker">×</button>
                    </div>
                    <div className="picker-options">
                      {questionOptions.map((option, i) => (
                        <div
                          key={i}
                          className="picker-option"
                          onClick={() => selectQuestion(option)}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <input
                type="text"
                className="answer-input"
                placeholder="Your answer..."
                value={answers[index]}
                onChange={(e) => setAnswer(index, e.target.value)}
                disabled={!isEnabled(index)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoffeeProfile;