import { useEffect } from "react";

/* eslint-disable @typescript-eslint/no-unused-vars */

export type AnswerType = {
  id: number;
  content: string;
  answerIndex: number;
};

export type AnswerProps = {
  id: number;
  content: string;
  answerIndex: number;
  onSlected: (id: number) => void;
  isFinished?: boolean;
  isSelected: boolean;
  isCorrect: boolean;
  isBad: boolean;
};

const Answer = ({
  id,
  content,
  answerIndex,
  onSlected,
  isCorrect,
  isSelected,
  isBad,
}: AnswerProps) => {
  useEffect(() => {
    console.log(isCorrect);
  }, [isCorrect]);

  return (
    <div
      className={`answer ${isSelected && "answer--selected"} ${isSelected && isBad && "answer--bad"} ${isCorrect && "answer--correct"}`}
      onClick={() => onSlected(answerIndex)}
    >
      <p className="answer__text">{content}</p>
    </div>
  );
};

export default Answer;
