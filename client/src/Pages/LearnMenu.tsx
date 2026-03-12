import { Link } from "react-router-dom";
import TruckLogo from "../assets/truck.svg?react";

const LearnMenu = () => {
  return (
    <div className="learn__menu">
      <div className="learn__title">
        <TruckLogo className="logo logo--big" />
        <h2 className="learn__title__header">Kwalifikacja Wstępna</h2>
      </div>
      <Link to="/learn/basic" className="button">
        Część Podstawowa
      </Link>
      <Link to="/learn/special" className="button">
        Część Specialistyczna
      </Link>
    </div>
  );
};

export default LearnMenu;
