import React from "react";
import "./side-question-list.css";
import { IoIosFlag } from "react-icons/io";
const SideQuestionList = ({
  numberOfQuestions,
  selectedAnswers,
  flaggedQuestions,
  goToQuestion,
}) => {
  const getQuestionStatus = (questionIndex) => {
    return selectedAnswers[questionIndex];
  };
  const getFlaggedStatus = (questionIndex) => {
    return flaggedQuestions.includes(questionIndex);
  };

  console.log("side=" + flaggedQuestions);

  return (
    <div className="question-sheet-list">
      {Array.from({ length: numberOfQuestions }).map((_, index) => (
        <button
          className={`question-selection-item ${
            getQuestionStatus(index) ? "selected" : ""
          }`}
          key={index}
          onClick={() => goToQuestion(index)}
        >
          {index + 1}
          {flaggedQuestions.length > 0 && getFlaggedStatus(index) && (
            <IoIosFlag color={"red"} size={10} className="q-flagged" />
          )}
        </button>
      ))}
    </div>
  );
};

export default SideQuestionList;
