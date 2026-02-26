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

const LearnBasic = ({
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
  //   const [userAnswer, setUserAnswer] = useState<number>();
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
          `${apiUrl}/auth/addWrongBaseQuestion/${questionId}`,
          requestOptions,
        );
        const temp = [...userData.wrongBaseIds, questionId];
        const user = { ...userData, wrongBaseIds: temp };
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
          `${apiUrl}/auth/removeWrongBaseQuestion/${questionId}`,
          requestOptions,
        );
        const temp = userData.wrongBaseIds.filter(
          (item) => item !== questionId,
        );
        const user = { ...userData, wrongBaseIds: temp };
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
      fetch(`${apiUrl}/auth/addTaggedBaseQuestion/${id}`, reqOptions);
      if (userData.taggedBaseIds.includes(id)) {
        const temp = userData.taggedBaseIds.filter((item) => item !== id);
        const user = { ...userData, taggedBaseIds: temp };
        setTagged(false);
        handleUserData(user);
      } else {
        const temp = [...userData.taggedBaseIds, id];
        const user = { ...userData, taggedBaseIds: temp };
        setTagged(true);
        handleUserData(user);
      }
    }
  };

  const GetQuestion = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/api/Question/base/${id}`);
      const data = await response.json();
      const result = data.data as QuestionType;
      setQuestion(result);
      setLoading(false);
    } catch (err) {
      console.log(err);

      setError(true);
    }
  };

  const handleNext = () => {
    if (questionQuantity !== null && questionQuantity !== undefined) {
      if (questionCount + 1 < questionQuantity) {
        setLoading(true);
        GetQuestion(questionCount + 1);
        setQuestionCount(questionCount + 1);
        setIsFinished(false);
        if (userData !== null) {
          const temp = { ...userData, baseProgress: questionCount + 1 };
          handleUserData(temp);
        }
      } else {
        setLoading(true);
        GetQuestion(1);
        setQuestionCount(1);
        setIsFinished(true);
        if (userData !== null) {
          const temp = { ...userData, baseProgress: 0 };
          handleUserData(temp);
        }
      }
    }
  };

  const handlePrevious = () => {
    if (questionQuantity !== null && questionQuantity !== undefined) {
      if (questionCount > 0) {
        setLoading(true);
        GetQuestion(questionCount - 1);
        setQuestionCount(questionCount - 1);
        setIsFinished(false);
        if (userData !== null) {
          const temp = { ...userData, baseProgress: questionCount - 1 };
          handleUserData(temp);
        }
      }
    }
  };

  useEffect(() => {
    const LoadData = async () => {
      try {
        let id = userData !== null ? userData.baseProgress : questionCount;
        id = id === 0 ? 1 : id;
        console.log(`${apiUrl}/api/Question/base/${id}`);

        const response = await fetch(`${apiUrl}/api/Question/base/${id}`);
        const result = await response.json();
        const data = result.data as QuestionType;
        // console.log(data);
        setQuestion(data);
        setLoading(false);
        setQuestionCount(id);

        const localQuantity = localStorage.getItem("baseQuantity");

        if (localQuantity === null) {
          const questionQuantity = await fetch(
            `${apiUrl}/api/Question/baseQuantity`,
          );
          const qresult = await questionQuantity.json();
          setQuestionQuantity(qresult.data);
          localStorage.setItem("baseQuantity", `${qresult.data}`);
        } else {
          const questionQuantity = Number(localQuantity);
          setQuestionQuantity(questionQuantity);
        }

        if (userData?.taggedBaseIds.includes(id)) {
          setTagged(true);
        }
      } catch (err) {
        console.log(err);
        setError(true);
      }
    };

    LoadData();
  }, [apiUrl]);

  if (error == true) return <Error message={"dupa"} />;

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

          {/* if(ques) */}
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

export default LearnBasic;
