import { useEffect, useState } from "react";
import Question, {
  type QuestionProps,
  type QuestionType,
} from "../Compoents/Question";
import type { AnswerType } from "../Compoents/Answer";
import { Link } from "react-router-dom";

export type TestProps = {
  isLoggedIn: boolean;
};

type TestType = {
  baseQuestions: QuestionProps[];
  specialQuestions: QuestionProps[];
};

const Test = ({ isLoggedIn }: TestProps) => {
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [taggedQuestions, setTaggedQuestions] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [questions, setQuestions] = useState<TestType>({
    baseQuestions: [],
    specialQuestions: [],
  });

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const data = userString ? JSON.parse(userString) : null;
    setTaggedQuestions(data.taggedBaseIds);
    console.log(data);
  }, []);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        console.log(`${apiUrl}/api/Question/test`);

        const response = await fetch(`${apiUrl}/api/Question/test`);
        const data = await response.json();
        console.log(data.data);
        const baseQuestions = data.data.baseQuestions.map(
          (q: QuestionType) => ({
            id: q.id,
            content: q.content,
            image: q.image,
            correctAnswerId: q.correctAnswerId,
            answers: q.answers.map((a: AnswerType) => ({
              id: a.id,
              content: a.content,
              answerIndex: a.answerIndex,
            })),
          }),
        );

        const specialQuestions = data.data.specialQuestions.map(
          (q: QuestionType) => ({
            id: q.id,
            content: q.content,
            image: q.image,
            correctAnswerId: q.correctAnswerId,
            answers: q.answers.map((a: AnswerType) => ({
              id: a.id,
              content: a.content,
              answerIndex: a.answerIndex,
            })),
          }),
        );
        console.log(data.data.baseQuestions);
        setQuestions({ baseQuestions, specialQuestions });
      } catch (error) {
        console.error("Error loading questions:", error);
      }
    };
    loadQuestions();
  }, []);

  const handleSelectAnswer = (questionId: number, answerIndex: number) => {
    if (!isFinished) {
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: answerIndex,
      }));
    }
  };

  const handleFinish = () => {
    if (!isFinished) {
      let correctAnswers: number[] = [],
        badAnswers: number[] = [];
      let correctCount = 0;
      questions.baseQuestions.forEach((q) => {
        if (userAnswers[q.id] === q.correctAnswerId) {
          correctCount++;
          correctAnswers = [...correctAnswers, q.id];
        } else {
          // console.log(userAnswers);
          badAnswers = [...badAnswers, q.id];
        }
      });
      setIsFinished(true);
      setScore(correctCount);
      if (isLoggedIn) {
        const token = localStorage.getItem("token");
        if (badAnswers.length > 0) {
          SendBadQuestions(badAnswers, token);
        }
        if (correctAnswers.length > 0) {
          RemoveCorrectAnswers(correctAnswers, token);
        }
      }
    }
  };

  const handleTag = (id: number) => {
    const reqOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    fetch(`${apiUrl}/auth/addTaggedBaseQuestion/${id}`, reqOptions);
    if (taggedQuestions.includes(id)) {
      const temp = taggedQuestions.filter((item) => item !== id);
      setTaggedQuestions(temp);
    } else {
      setTaggedQuestions((prev) => [...prev, id]);
    }
  };

  const SendBadQuestions = (badAnswers: number[], token: string | null) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify([...badAnswers]),
    };
    fetch(`${apiUrl}/auth/addWrongBaseQuestions`, requestOptions).then(
      (response) => response.json().then,
      (data) => {
        console.log(data);
      },
    );
  };

  const RemoveCorrectAnswers = (
    correctAnswers: number[],
    token: string | null,
  ) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify([...correctAnswers]),
    };
    fetch(`${apiUrl}/auth/removeWrongBaseQuestions`, requestOptions).then(
      (response) => response.json().then,
      (data) => {
        console.log(data);
      },
    );
  };

  return (
    <div className="test">
      {questions.baseQuestions.map((q) => (
        <Question
          key={q.id}
          {...q}
          handleSelectAnswer={handleSelectAnswer}
          isFinished={isFinished}
          isLoggedIn={isLoggedIn}
          tagged={taggedQuestions.includes(q.id)}
          handleTag={handleTag}
        />
      ))}
      <div className="test__end">
        {isFinished ? (
          <div className="test__score-wrapper">
            <h4 className="test__score">Wynik</h4>
            <p className="test__scrore-number">
              {score} / {questions.baseQuestions.length}
            </p>
          </div>
        ) : null}
        {!isFinished ? (
          <button className="test__button" onClick={handleFinish}>
            Zakończ
          </button>
        ) : (
          <Link to="/test/special" className="button">
            Część Specialistyczna
          </Link>
        )}
      </div>
    </div>
  );
};

export default Test;
