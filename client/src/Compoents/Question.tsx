import Answer, { type AnswerType } from "./Answer";
import { FaFlag } from "react-icons/fa";

import defaultImg from "../assets/question.png";
import { useState } from "react";

export type QuestionProps = {
  id: number;
  image: string;
  content: string;
  correctAnswerId: number;
  answers: AnswerType[];
  handleSelectAnswer: (id: number, answerId: number) => void;
  isFinished: boolean;
  isLoggedIn: boolean;
  tagged: boolean;
  handleTag: (id: number) => void;
};

export type QuestionType = {
  id: number;
  image: string;
  content: string;
  correctAnswerId: number;
  answers: AnswerType[];
};

const Question = ({
  id,
  content,
  image,
  correctAnswerId,
  answers,
  isFinished,
  isLoggedIn,
  tagged,
  handleTag,
  handleSelectAnswer,
}: QuestionProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (answerIndex: number) => {
    if (!isFinished) {
      setSelectedId(answerIndex);
      handleSelectAnswer(id, answerIndex);
    }
  };

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="question">
      <h3
        className={`question__text ${selectedId === correctAnswerId ? isFinished && "question__text--correct" : isFinished && "question__text--bad"}`}
      >
        {content}
      </h3>
      <div className="question__image-wrapper">
        {image === null ? (
          <img className="question__image" src={defaultImg} alt="" />
        ) : (
          <img
            className="question__image"
            src={`${baseUrl}/${image}`}
            alt="Nie ma zdj"
          />
        )}
      </div>
      {isLoggedIn && (
        <FaFlag
          className={`question__tag ${tagged ? "question__tag--tagged" : ""}`}
          onClick={() => {
            handleTag(id);
          }}
        />
      )}
      <div className="question__answers">
        {answers.map((answer: AnswerType) => (
          <Answer
            key={answer.id}
            {...answer}
            onSlected={handleSelect}
            isFinished={isFinished}
            isSelected={selectedId === answer.answerIndex}
            isCorrect={answer.answerIndex === correctAnswerId && isFinished}
            isBad={selectedId !== correctAnswerId && isFinished}
          />
        ))}
      </div>
    </div>
  );
};

export default Question;
