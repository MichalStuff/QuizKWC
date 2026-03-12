import { Link } from "react-router-dom";
import Button from "../Compoents/Button";
import TruckLogo from "../assets/truck.svg?react";

export type MainProps = {
  isLoggedIn: boolean;
  handleLogout: () => void;
};

const Main = ({ isLoggedIn, handleLogout }: MainProps) => {
  return (
    <div className="main">
      <div className="main__title">
        <TruckLogo className="logo logo--big" />
        <h2 className="main__title__header">Kwalifikacja Wstępna</h2>
      </div>
      {isLoggedIn ? (
        <Button
          text="Wyloguj się"
          className="button--secondary"
          onClick={handleLogout}
        />
      ) : (
        <Link to="/login" className="button button--secondary">
          Zaloguj się
        </Link>
      )}
      {!isLoggedIn ? (
        <Link to="/register" className="button button--secondary">
          Zarejesturj się
        </Link>
      ) : null}
      <Link to="/learn" className="button">
        Tryb Nauki
      </Link>
      <Link to="/test" className="button">
        Tryb Testu
      </Link>
      {isLoggedIn ? (
        <Link to="/user/questions" className="button">
          Pytania Użytkownika
        </Link>
      ) : null}
    </div>
  );
};

export default Main;
