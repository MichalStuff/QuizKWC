import { useEffect } from "react";

/* eslint-disable @typescript-eslint/no-unused-vars */
export type AnswerProps = {
  Id: number;
  Content: string;
  QuestionId: number;
  onSlected: (id: number) => void;
  isSelected: boolean;
  isCorrect: boolean;
  isBad: boolean;
};

const Answer = ({
  Id,
  Content,
  QuestionId,
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
      onClick={() => onSlected(Id)}
    >
      <p className="answer__text">{Content}</p>
    </div>
  );
};

export default Answer;
