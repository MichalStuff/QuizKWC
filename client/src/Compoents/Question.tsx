import Answer, { type AnswerProps } from "./Answer";
import defaultImg from "../assets/question.png";
import { useEffect, useState } from "react";

export type QuestionProps = {
  Id: number;
  Content: string;
  Image: string | null;
  answers: AnswerProps[];
  CorrectAnsId: number;
  handleSelectAnswer: (id: number, answerId: number) => void;
  isFinished: boolean;
};

const Question = ({
  Id,
  Content,
  Image,
  CorrectAnsId,
  answers,
  isFinished,
  handleSelectAnswer,
}: QuestionProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    console.log(isFinished);
  }, [isFinished]);

  const handleSelect = (answerId: number) => {
    setSelectedId(answerId);
    console.log(answerId);
    handleSelectAnswer(Id, answerId);
  };

  return (
    <div className="question">
      <h3 className="question__text">{Content}</h3>
      <div className="question__image-wrapper">
        {Image === null ? (
          <img className="question__image" src={defaultImg} alt="" />
        ) : (
          <img className="question__image" src={Image} alt="Nie ma zdj" />
        )}
      </div>
      <div className="question__answers"></div>
      {answers.map((answer) => (
        <Answer
          key={answer.Id}
          {...answer}
          onSlected={handleSelect}
          isSelected={selectedId === answer.Id}
          isCorrect={answer.Id === CorrectAnsId && isFinished}
          isBad={selectedId !== CorrectAnsId && isFinished}
        />
      ))}
    </div>
  );
};

export default Question;
