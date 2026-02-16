import { useEffect, useState } from "react";
import Question, { type QuestionProps } from "../Compoents/Question";

export type TestProps = {
  questions: QuestionProps[];
};

const Test = ({ questions }: TestProps) => {
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const handleSelectAnswer = (questionId: number, answerId: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleFinish = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.Id] === q.CorrectAnsId) {
        correctCount++;
      }
    });
    setIsFinished(true);
    setScore(correctCount);
    console.log(isFinished);
  };

  useEffect(() => {
    console.log(userAnswers);
  }, [userAnswers]);

  return (
    <div className="test">
      <>
        {questions.map((q) => (
          <Question
            key={q.Id}
            {...q}
            handleSelectAnswer={handleSelectAnswer}
            isFinished={isFinished}
          />
        ))}
        <div className="test__end">
          {isFinished ? (
            <div className="test__score-wrapper">
              <h4 className="test__score">Wynik</h4>
              <p className="test__scrore-number">
                {score} / {questions.length}
              </p>
            </div>
          ) : null}
          <button className="test__button" onClick={handleFinish}>
            Zakończ
          </button>
        </div>
      </>
    </div>
  );
};

export default Test;
