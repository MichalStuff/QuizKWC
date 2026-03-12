import { useEffect, useState } from "react";
import type { UserDataType } from "../App";
import type { QuestionType } from "../Compoents/Question";
import Error from "../Compoents/Error";
import Loading from "../Compoents/Loading";
import Question from "../Compoents/Question";
import Button from "../Compoents/Button";

export type LearnBasicProps = {
  isLoggedIn: boolean;
  userData: UserDataType | null;
  handleUserData: (user: UserDataType) => void;
};

const LearnSpecial = ({
  isLoggedIn,
  userData,
  handleUserData,
}: LearnBasicProps) => {
  const [question, setQuestion] = useState<QuestionType>();
  const [questionQuantity, setQuestionQuantity] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [tagged, setTagged] = useState<boolean>(false);
  const [questionCount, setQuestionCount] = useState<number>(1);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const handleSelectAnswer = (
    questionId: number,
    answerIndex: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type: number,
  ) => {
    if (userData !== null) {
      if (question?.correctAnswerId !== answerIndex) {
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(questionId),
        };
        fetch(
          `${apiUrl}/auth/addWrongSpecialQuestion/${questionId}`,
          requestOptions,
        );
        const temp = [...userData.wrongSpecialIds, questionId];
        const user = { ...userData, wrongSpecialIds: temp };
        handleUserData(user);
      }
      if (question?.correctAnswerId === answerIndex) {
        const requestOptions: RequestInit = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(questionId),
        };
        fetch(
          `${apiUrl}/auth/removeWrongSpecialQuestion/${questionId}`,
          requestOptions,
        );
        const temp = userData.wrongSpecialIds.filter(
          (item) => item !== questionId,
        );
        const user = { ...userData, wrongSpecialIds: temp };
        handleUserData(user);
      }
    }
    setIsFinished(true);
  };

  const handleTag = (id: number) => {
    if (userData !== null) {
      const reqOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      fetch(`${apiUrl}/auth/addTaggedSpecialQuestion/${id}`, reqOptions);
      if (userData.taggedSpecialIds.includes(id)) {
        const temp = userData.taggedSpecialIds.filter((item) => item !== id);
        const user = { ...userData, taggedSpecialIds: temp };
        setTagged(false);
        handleUserData(user);
      } else {
        const temp = [...userData.taggedSpecialIds, id];
        const user = { ...userData, taggedSpecialIds: temp };
        setTagged(true);
        handleUserData(user);
      }
    }
  };

  const GetQuestion = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/api/Question/special/${id}`);
      const data = await response.json();
      const result = data.data as QuestionType;
      setQuestion(result);
      setLoading(false);
      if (userData?.taggedBaseIds.includes(id)) {
        setTagged(true);
      } else {
        setTagged(false);
      }
    } catch (err) {
      console.log(err);

      setError(true);
    }
  };

  const handleNext = async () => {
    if (questionQuantity !== null && questionQuantity !== undefined) {
      if (questionCount + 1 < questionQuantity) {
        setLoading(true);
        GetQuestion(questionCount + 1);
        setQuestionCount(questionCount + 1);
        setIsFinished(false);

        if (userData !== null) {
          const temp = { ...userData, specialProgress: questionCount + 1 };
          handleUserData(temp);
          const reqOptions: RequestInit = {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(questionCount + 1),
          };
          // console.log(reqOptions);

          await fetch(`${apiUrl}/auth/specialProgress`, reqOptions);
          // console.log(res);
        }
      } else {
        setLoading(true);
        GetQuestion(1);
        setQuestionCount(1);
        setIsFinished(true);
        if (userData !== null) {
          const temp = { ...userData, specialProgress: 1 };
          handleUserData(temp);
          const reqOptions: RequestInit = {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(1 + 1),
          };
          // console.log(reqOptions);

          fetch(`${apiUrl}/auth/specialProgress`, reqOptions);
        }
      }
    }
  };

  const handlePrevious = () => {
    if (questionQuantity !== null && questionQuantity !== undefined) {
      if (questionCount > 1) {
        setLoading(true);
        GetQuestion(questionCount - 1);
        setQuestionCount(questionCount - 1);
        setIsFinished(false);
        if (userData !== null) {
          const temp = { ...userData, specialProgress: questionCount - 1 };
          handleUserData(temp);
          const reqOptions: RequestInit = {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(questionCount - 1),
          };
          // console.log(reqOptions);

          fetch(`${apiUrl}/auth/specialProgress`, reqOptions);
        }
      }
    }
  };

  useEffect(() => {
    const LoadData = async () => {
      try {
        let id = userData !== null ? userData.specialProgress : questionCount;
        id = id === 0 ? 1 : id;
        // console.log(`${apiUrl}/api/Question/special/${id}`);

        const response = await fetch(`${apiUrl}/api/Question/special/${id}`);
        const result = await response.json();
        const data = result.data as QuestionType;
        // console.log(data);
        setQuestion(data);
        setLoading(false);
        setQuestionCount(id);

        const localQuantity = localStorage.getItem("specialQuantity");

        if (localQuantity === null) {
          const questionQuantity = await fetch(
            `${apiUrl}/api/Question/specialQuantity`,
          );
          const qresult = await questionQuantity.json();
          setQuestionQuantity(qresult.data);
          localStorage.setItem("specialQuantity", `${qresult.data}`);
        } else {
          const questionQuantity = Number(localQuantity);
          setQuestionQuantity(questionQuantity);
        }

        if (userData?.taggedSpecialIds.includes(id)) {
          setTagged(true);
        }
      } catch (err) {
        console.log(err);
        setError(true);
      }
    };

    LoadData();
  }, [apiUrl]);

  if (error == true) return <Error />;

  return (
    <div className="learn">
      {loading === true ? (
        <Loading />
      ) : (
        <>
          <div className="learn__top">
            <h2 className="learn__counter">
              Pytanie {questionCount} z {questionQuantity}
            </h2>
          </div>
          {question !== undefined ? (
            <Question
              id={question.id}
              answers={question.answers}
              content={question.content}
              correctAnswerId={question.correctAnswerId}
              image={question.image}
              type={question.type}
              handleSelectAnswer={handleSelectAnswer}
              isFinished={isFinished}
              isLoggedIn={isLoggedIn}
              tagged={tagged}
              handleTag={handleTag}
            />
          ) : null}

          <div className="learn__bottom">
            <Button
              text="Poprzednie"
              className="button--small button--secondary"
              onClick={handlePrevious}
            />
            <Button
              text="Następne"
              className="button--small button--secondary"
              onClick={handleNext}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LearnSpecial;
