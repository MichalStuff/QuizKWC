import { Link } from "react-router-dom";
import Button from "../Compoents/Button";

export type MainProps = {
  isLoggedIn: boolean;
  handleLogout: () => void;
};

const Main = ({ isLoggedIn, handleLogout }: MainProps) => {
  return (
    <div className="main">
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
    </div>
  );
};

export default Main;
