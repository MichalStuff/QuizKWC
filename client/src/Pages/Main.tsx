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
      <Button text="Tryb Nauki" />
      <Button text="Tryb Testu" />
    </div>
  );
};

export default Main;
