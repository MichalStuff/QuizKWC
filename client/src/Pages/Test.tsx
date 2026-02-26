import { useEffect, useState } from "react";
import Question, {
  type QuestionProps,
  type QuestionType,
} from "../Compoents/Question";
import type { AnswerType } from "../Compoents/Answer";
import { Link } from "react-router-dom";
import Loading from "../Compoents/Loading";
import TruckLogo from "../assets/truck.svg?react";
import Error from "../Compoents/Error";
import type { UserDataType } from "../App";

export type TestProps = {
  isLoggedIn: boolean;
  userData: UserDataType | null;
  handleUserData: (data: UserDataType) => void;
};

type TestType = {
  baseQuestions: QuestionProps[];
  specialQuestions: QuestionProps[];
};

const Test = ({ isLoggedIn, userData, handleUserData }: TestProps) => {
  const [isFinished, setIsFinished] = useState<{
    base: boolean;
    special: boolean;
  }>({ base: false, special: false });
  const [taggedQuestions, setTaggedQuestions] = useState<{
    base: number[];
    special: number[];
  }>({
    base: [],
    special: [],
  });
  const [score, setScore] = useState<{ base: number; special: number }>({
    base: 0,
    special: 0,
  });
  const [userAnswers, setUserAnswers] = useState<{
    base: Record<number, number>;
    special: Record<number, number>;
  }>({ base: {}, special: {} });
  const [questions, setQuestions] = useState<TestType>({
    baseQuestions: [],
    specialQuestions: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const data = userData;
    if (data !== null) {
      setTaggedQuestions({
        base: data.taggedBaseIds,
        special: data.taggedSpecialIds,
      });
    } else {
      setTaggedQuestions({
        base: [],
        special: [],
      });
    }
    console.log("OPA");
  }, [userData]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
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
            type: q.type,
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
            type: q.type,
          }),
        );
        setQuestions({ baseQuestions, specialQuestions });
        setLoading(false);
      } catch (error) {
        console.error("Error loading questions:", error);
        setError(true);
      }
    };
    loadQuestions();
  }, [apiUrl]);

  const handleSelectAnswer = (
    questionId: number,
    answerIndex: number,
    type: number,
  ) => {
    if (type === 0) {
      if (!isFinished.base) {
        setUserAnswers((prev) => ({
          base: { ...prev.base, [questionId]: answerIndex },
          special: prev.special,
        }));
      }
    }
    if (type === 1) {
      if (!isFinished.special) {
        setUserAnswers((prev) => ({
          base: prev.base,
          special: { ...prev.special, [questionId]: answerIndex },
        }));
      }
    }
  };

  const handleFinish = () => {
    if (!isFinished.base) {
      let correctAnswers: number[] = [],
        badAnswers: number[] = [];
      let correctCount = 0;
      questions.baseQuestions.forEach((q) => {
        if (userAnswers.base[q.id] === q.correctAnswerId) {
          correctCount++;
          correctAnswers = [...correctAnswers, q.id];
        } else {
          // console.log(userAnswers);
          badAnswers = [...badAnswers, q.id];
        }
      });
      setIsFinished((prev) => ({ base: true, special: prev.special }));
      console.log("Correct count " + correctCount);

      setScore((prev) => ({ base: correctCount, special: prev.special }));
      if (isLoggedIn) {
        const token = localStorage.getItem("token");
        if (badAnswers.length > 0) {
          SendBadQuestions(badAnswers, token, 0);
        }
        if (correctAnswers.length > 0) {
          RemoveCorrectAnswers(correctAnswers, token, 0);
        }
      }
    }

    if (!isFinished.special && isFinished.base) {
      let correctAnswers: number[] = [],
        badAnswers: number[] = [];
      let correctCount = 0;
      questions.specialQuestions.forEach((q) => {
        if (userAnswers.special[q.id] === q.correctAnswerId) {
          correctCount++;
          correctAnswers = [...correctAnswers, q.id];
        } else {
          // console.log(userAnswers);
          badAnswers = [...badAnswers, q.id];
        }
      });
      setIsFinished((prev) => ({ base: prev.base, special: true }));
      console.log("Correct count " + correctCount);

      setScore((prev) => ({ base: prev.base, special: correctCount }));
      if (isLoggedIn) {
        const token = localStorage.getItem("token");
        if (badAnswers.length > 0) {
          SendBadQuestions(badAnswers, token, 1);
        }
        if (correctAnswers.length > 0) {
          RemoveCorrectAnswers(correctAnswers, token, 1);
        }
      }
    }
  };

  const handleBaseTag = (id: number) => {
    if (userData !== null) {
      const reqOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      fetch(`${apiUrl}/auth/addTaggedBaseQuestion/${id}`, reqOptions);
      if (taggedQuestions.base.includes(id)) {
        const temp = taggedQuestions.base.filter((item) => item !== id);
        // setTaggedQuestions((prev) => ({ base: temp, special: prev.special }));
        const user = { ...userData, taggedBaseIds: temp };

        handleUserData(user);
      } else {
        // setTaggedQuestions((prev) => ({
        //   base: [...prev.base, id],
        //   special: prev.special,
        // }));
        const temp = [...userData.taggedBaseIds, id];
        const user = { ...userData, taggedBaseIds: temp };
        handleUserData(user);
      }
    }
  };

  const handleSpecialTag = (id: number) => {
    if (userData !== null) {
      const reqOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      fetch(`${apiUrl}/auth/addTaggedSpecialQuestion/${id}`, reqOptions);
      if (taggedQuestions.special.includes(id)) {
        const temp = taggedQuestions.special.filter((item) => item !== id);
        // setTaggedQuestions((prev) => ({ base: prev.base, special: temp }));
        const user = { ...userData, taggedSpecialIds: temp };
        handleUserData(user);
      } else {
        // setTaggedQuestions((prev) => ({
        //   base: prev.base,
        //   special: [...prev.special, id],
        // }));
        const temp = [...userData.taggedSpecialIds, id];
        const user = { ...userData, taggedSpecialIds: temp };
        handleUserData(user);
      }
    }
  };

  const SendBadQuestions = (
    badAnswers: number[],
    token: string | null,
    type: number,
  ) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify([...badAnswers]),
    };
    fetch(
      `${apiUrl}/auth/${type === 0 ? "addWrongBaseQuestions" : "addWrongSpecialQuestions"}`,
      requestOptions,
    ).then(
      (response) => response.json().then,
      (data) => {
        console.log(data);
      },
    );
  };

  const RemoveCorrectAnswers = (
    correctAnswers: number[],
    token: string | null,
    type: number,
  ) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const requestOptions: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify([...correctAnswers]),
    };
    fetch(
      `${apiUrl}/auth/${type === 0 ? "removeWrongBaseQuestions" : "removeWrongSpecialQuestions"} `,
      requestOptions,
    ).then(
      (response) => response.json().then,
      (data) => {
        console.log(data);
      },
    );
  };

  if (error) return <Error />;

  return (
    <div className="test">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="test__title">
            <TruckLogo className="logo logo--big" />
            <h2 className="test__title__header">
              Test na Kwalifikację Wstępną
            </h2>
            <p className="test__title__text">Część ogólna</p>
          </div>
          {questions.baseQuestions.map((q) => (
            <div className="test__question-wrapper">
              <Question
                key={q.id}
                {...q}
                handleSelectAnswer={handleSelectAnswer}
                isFinished={isFinished.base}
                isLoggedIn={isLoggedIn}
                tagged={taggedQuestions.base.includes(q.id)}
                handleTag={handleBaseTag}
              />
            </div>
          ))}
          <div className="test__end">
            <TruckLogo className="logo logo--big" />
            {isFinished.base ? (
              <div className="test__score-wrapper">
                <h4 className="test__score">Wynik</h4>
                <h3 className="test__part">z części podstawowej</h3>
                <p className="test__scrore-number">
                  {score.base} / {questions.baseQuestions.length}
                </p>
              </div>
            ) : (
              <h2 className="test__title__header">
                Zakończ egzamin i rozpocznij część specialistyczną
              </h2>
            )}
            {!isFinished.base ? (
              <button className="test__button" onClick={handleFinish}>
                Zakończ
              </button>
            ) : null}
          </div>
          {isFinished.base === true ? (
            <>
              <div className="test__title">
                <TruckLogo className="logo logo--big" />
                <h2 className="test__title__header">
                  Test na Kwalifikację Wstępną
                </h2>
                <p className="test__title__text">Część ogólna</p>
              </div>
              {questions.specialQuestions.map((q) => (
                <Question
                  key={q.id}
                  {...q}
                  handleSelectAnswer={handleSelectAnswer}
                  isFinished={isFinished.special}
                  isLoggedIn={isLoggedIn}
                  tagged={taggedQuestions.special.includes(q.id)}
                  handleTag={handleSpecialTag}
                />
              ))}
              <div className="test__end">
                {isFinished.special ? (
                  <div className="test__score-wrapper">
                    <TruckLogo className="logo logo--big" />
                    <h4 className="test__score">Wynik</h4>
                    <p className="test__scrore-number">
                      {score.special} / {questions.specialQuestions.length}
                    </p>
                  </div>
                ) : null}
                {!isFinished.special ? (
                  <>
                    <TruckLogo className="logo logo--big" />
                    <button className="test__button" onClick={handleFinish}>
                      Zakończ
                    </button>
                  </>
                ) : (
                  <Link to="/" className="button">
                    Wróć Do Menu
                  </Link>
                )}
              </div>{" "}
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Test;
