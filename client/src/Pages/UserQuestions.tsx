import { Link } from "react-router-dom";
import type { UserDataType } from "../App";
import TruckLogo from "../assets/truck.svg?react";

export type UserQuestionsProps = {
  user: UserDataType | null;
};

const UserQuestions = () => {
  return (
    <div className="user-questions">
      <div className="main__title">
        <TruckLogo className="logo logo--big" />
        <h2 className="main__title__header">Kwalifikacja Wstępna</h2>
      </div>
      <Link to="/base/tagged" className="button">
        Oznaczone Podstawowe
      </Link>
      <Link to="/base/wrong" className="button">
        Błędne Podstawowe
      </Link>
      <Link to="/special/tagged" className="button">
        Oznaczone Specialistyczne
      </Link>
      <Link to="/special/wrong" className="button">
        Błędne Specialistyczne
      </Link>
    </div>
  );
};

export default UserQuestions;
