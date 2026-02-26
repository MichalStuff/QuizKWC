import { Link } from "react-router-dom";

const LearnMenu = () => {
  return (
    <div className="learn__menu">
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
