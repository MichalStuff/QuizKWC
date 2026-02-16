import Menu from "./Compoents/Menu";
import Test from "./Pages/Test";
import "./App.css";
import { useEffect, useState } from "react";
import type { QuestionProps } from "./Compoents/Question";
import Loading from "./Compoents/Loading";

const App = () => {
  const [questions, setQuestions] = useState<QuestionProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (error) return <div>Error</div>;

  return (
    <div className="App">
      <Menu />
      {loading ? <Loading /> : <Test questions={questions} />}
    </div>
  );
};

export default App;
