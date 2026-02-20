import Menu from "./Compoents/Menu";
import Test from "./Pages/Test";
import "./App.css";
import { useEffect, useState } from "react";
import type { QuestionProps } from "./Compoents/Question";
import Loading from "./Compoents/Loading";
import Main from "./Pages/Main";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { Route, Routes } from "react-router-dom";

const App = () => {
  const [questions, setQuestions] = useState<QuestionProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch(`/base.json`);
        const data = await response.json();
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        const random = shuffled.slice(0, 20);
        setQuestions(random);
        console.log(random);
      } catch (error) {
        setError(`Failed to load questions : ${error}`);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    console.log("loguot");
  };

  if (error) return <div>Error</div>;

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Main isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}
        />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/test"
          element={loading ? <Loading /> : <Test questions={questions} />}
        />
      </Routes>
    </div>
  );
};

export default App;
