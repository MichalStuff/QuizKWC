import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { UserDataType } from "../App";
import type { QuestionType } from "../Compoents/Question";
import Question from "../Compoents/Question";
import Loading from "../Compoents/Loading";
import Error from "../Compoents/Error";
import Empty from "../Compoents/Empty";

export type UserQuestionProps = {
  userData: UserDataType | null;
  handleUserData: (userData: UserDataType) => void;
};

const UserQuestion = ({ userData, handleUserData }: UserQuestionProps) => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<Record<number, boolean>>({});

  const pathname = useLocation().pathname;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleWrong = (
    questionId: number,
    answerIndex: number,
    type: number,
  ) => {
    if (userData !== null) {
      const requestOptions: RequestInit = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(questionId),
      };
      if (type === 0 && questions[questionId].correctAnswerId === answerIndex) {
        const user = {
          ...userData,
          wrongBaseIds: userData.wrongBaseIds.filter((q) => q !== questionId),
        };
        handleUserData(user);
        fetch(
          `${apiUrl}/auth/removeWrongBaseQuestion/${questionId}`,
          requestOptions,
        );
        console.log(user);
      }
      if (type === 1 && questions[questionId].correctAnswerId === answerIndex) {
        const user = {
          ...userData,
          wrongSpecialIds: userData.wrongSpecialIds.filter(
            (q) => q !== questionId,
          ),
        };
        console.log(user);

        handleUserData(user);
        fetch(
          `${apiUrl}/auth/removeWrongSpecialQuestion/${questionId}`,
          requestOptions,
        );
      }
    }
  };

  const handleSelectAnswear = (
    questionId: number,
    answerIndex: number,
    type: number,
  ) => {
    if (userData !== null) {
      setIsFinished((prev) => ({
        ...prev,
        [questionId]: true,
      }));
      if (pathname === "/base/wrong")
        handleWrong(questionId, answerIndex, type);
      if (pathname === "/special/wrong")
        handleWrong(questionId, answerIndex, type);
    }
  };

  const handleTag = (id: number) => {
    if (userData !== null) {
      const reqOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      switch (pathname) {
        case "/base/tagged":
          fetch(`${apiUrl}/auth/addTaggedBaseQuestion/${id}`, reqOptions);
          if (userData.taggedBaseIds.includes(id)) {
            const temp = userData.taggedBaseIds.filter((item) => item !== id);
            const user = { ...userData, taggedBaseIds: temp };
            handleUserData(user);
          } else {
            const temp = [...userData.taggedBaseIds, id];
            const user = { ...userData, taggedBaseIds: temp };
            handleUserData(user);
          }
          break;
        case "/base/wrong":
          fetch(`${apiUrl}/auth/addTaggedBaseQuestion/${id}`, reqOptions);
          if (userData.taggedBaseIds.includes(id)) {
            const temp = userData.taggedBaseIds.filter((item) => item !== id);
            const user = { ...userData, taggedBaseIds: temp };
            handleUserData(user);
          } else {
            const temp = [...userData.taggedBaseIds, id];
            const user = { ...userData, taggedBaseIds: temp };
            handleUserData(user);
          }
          break;
        case "/special/tagged":
          fetch(`${apiUrl}/auth/addTaggedSpecialQuestion/${id}`, reqOptions);
          if (userData.taggedSpecialIds.includes(id)) {
            const temp = userData.taggedSpecialIds.filter(
              (item) => item !== id,
            );
            const user = { ...userData, taggedSpecialIds: temp };
            handleUserData(user);
          } else {
            const temp = [...userData.taggedSpecialIds, id];
            const user = { ...userData, taggedSpecialIds: temp };
            handleUserData(user);
          }
          break;
        case "/special/wrong":
          fetch(`${apiUrl}/auth/addTaggedSpecialQuestion/${id}`, reqOptions);
          if (userData.taggedSpecialIds.includes(id)) {
            const temp = userData.taggedSpecialIds.filter(
              (item) => item !== id,
            );
            const user = { ...userData, taggedSpecialIds: temp };
            handleUserData(user);
          } else {
            const temp = [...userData.taggedSpecialIds, id];
            const user = { ...userData, taggedSpecialIds: temp };
            handleUserData(user);
          }
          break;
      }
    }
  };

  useEffect(() => {
    const LoadData = async (path: string, list: number[]) => {
      const reqOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(list),
      };
      try {
        const response = await fetch(
          `${apiUrl}/api/Question${path}`,
          reqOptions,
        );
        const result = await response.json();
        const data = result.data as QuestionType[];
        console.log(data);
        const tempFinish = data.reduce<Record<number, boolean>>((acc, q) => {
          acc[q.id] = false;
          return acc;
        }, {});

        setQuestions(data);
        setLoading(false);
        setIsFinished(tempFinish);
      } catch (err) {
        setError(true);
        console.log(err);
      }
    };

    if (userData != null) {
      switch (pathname) {
        case "/base/tagged":
          LoadData("/base/list", userData.taggedBaseIds);
          break;
        case "/base/wrong":
          LoadData("/base/list", userData.wrongBaseIds);
          break;
        case "/special/tagged":
          LoadData("/special/list", userData.taggedSpecialIds);
          break;
        case "/special/wrong":
          LoadData("/special/list", userData.wrongSpecialIds);
          break;
      }
    }
    console.log("RENDER");
  }, [pathname, userData, apiUrl]);

  if (loading) return <Loading />;
  if (error) return <Error />;
  return (
    <div className="user-question">
      {questions.length === 0 || userData === null ? (
        <Empty />
      ) : (
        questions.map((q) => (
          <div key={q.id} className="user-question__wrapper">
            <Question
              key={q.id}
              {...q}
              handleTag={handleTag}
              isLoggedIn={true}
              isFinished={isFinished[q.id]}
              handleSelectAnswer={handleSelectAnswear}
              tagged={
                pathname.includes("/base")
                  ? userData.taggedBaseIds.includes(q.id) || false
                  : userData.taggedSpecialIds.includes(q.id) || false
              }
            />
          </div>
        ))
      )}
    </div>
  );
};

export default UserQuestion;
