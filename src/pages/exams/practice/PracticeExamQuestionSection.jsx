import React, { useEffect } from "react";
import DOMPurify from "dompurify";
import "./pr-exam-q.css";

const PracticeExamQuestionSection = ({
  question,
  qindex,
  onSelectAnswer,
  onFlaggedQuestion,
  qref,
  isCheckedDefault,
  checkDefaultStatusFlaggedQuestion,
}) => {
  const [isFlagged, setIsFlagged] = React.useState(false);
  const cleanContent = (content) => {
    const newContent = content.replace(/<[^>]*>?/gm, "");
    return DOMPurify.sanitize(newContent);
  };

  const onFlagged = (qindex) => {
    setIsFlagged(!isFlagged);
    onFlaggedQuestion(qindex);
  };

  useEffect(() => {
    setIsFlagged(checkDefaultStatusFlaggedQuestion(qindex));
  }, [qindex]);

  return (
    <div className="pr-exam-question-container" ref={qref}>
      <div className="pr-eq-content">
        <button
          className={`pr-eq-title ${isFlagged ? "flagged" : ""}`}
          onClick={() => onFlagged(qindex)}
        >
          {qindex + 1}
        </button>
        <div
          className="pr-eq-title-content"
          dangerouslySetInnerHTML={{
            __html: cleanContent(question?.title),
          }}
        ></div>
      </div>
      <div className="pr-eq-answers">
        {question?.answers.map((answer, index) => (
          <div key={index} className="pr-eq-answer">
            {/* radio */}
            <input
              checked={isCheckedDefault(qindex, answer?.id)}
              className="form-check-input"
              type="radio"
              name={`question-${question?.id}`}
              id={`question-${question?.id}-answer-${answer?.id}`}
              value={answer?.id}
              onChange={() => onSelectAnswer(question?.id, qindex, answer?.id)}
            />

            <label
              className="answer-radio-label"
              htmlFor={`question-${question?.id}-answer-${answer?.id}`}
            >
              <div className="pr-eq-answer-title">{answer?.letter}.</div>
              <div
                className="pr-eq-answer-content"
                dangerouslySetInnerHTML={{
                  __html: cleanContent(answer?.content),
                }}
              ></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeExamQuestionSection;
