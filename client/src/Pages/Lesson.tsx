import { useState } from "react";
import type { QuestionProps } from "../Compoents/Question";
import Question from "../Compoents/Question";

export type LessonProps = {
  question: QuestionProps[];
};

const Lesson = ({ question }: LessonProps) => {
  const [questionIndex, setquesionIndex] = useState<number>(0);
  return (
    <div className="lesson">
      <Question {...question} />
    </div>
  );
};

export default Lesson;
