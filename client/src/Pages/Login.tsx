import { FaLock, FaEnvelope } from "react-icons/fa";
import Button from "../Compoents/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type LoginUser = {
  email: string;
  password: string;
};

export type LoginProps = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login = ({ setIsLoggedIn }: LoginProps) => {
  const [focus, setfocus] = useState<"email" | "password" | null>(null);
  const [baseVerification, setBaseVerification] = useState({
    email: false,
    password: false,
  });
  const [user, setUser] = useState<LoginUser>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleFocus = (field: "email" | "password" | null) => {
    setfocus(field);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({ ...prev, email: e.target.value }));
    setBaseVerification((prev) => ({
      ...prev,
      email: checkEmail(e.target.value),
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({ ...prev, password: e.target.value }));
    setBaseVerification((prev) => ({
      ...prev,
      password: checkPassword(e.target.value),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    {
      e.preventDefault();
      if (baseVerification.email && baseVerification.password) {
        const requestOptions: RequestInit = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            password: user.password,
          }),
        };
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        fetch(`${apiUrl}/auth/login`, requestOptions).then((response) =>
          response.json().then((data) => {
            localStorage.setItem("token", data.data.token);
            setIsLoggedIn(true);
            console.log("Zalogowano pomyślnie");
            navigate("/");
          }),
        );
      }
    }
  };

  const checkEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPassword = (password: string) => {
    return password.length >= 6;
  };

  return (
    <div className="sign">
      <form className="sign__form" onSubmit={handleSubmit}>
        <h3
          className={`sign__title ${baseVerification.email && baseVerification.password ? "sign__title--ok" : ""}`}
        >
          Zaloguj się
        </h3>
        <div
          className={`sign__input__wrapper sign__input__wrapper--${focus === "email" ? "outline" : ""}`}
        >
          <FaEnvelope
            className={`sign__input__icon ${baseVerification.email ? "sign__input__icon--ok" : ""}`}
          />
          <input
            type="text"
            placeholder="E-mail"
            className="sign__input"
            onFocus={() => handleFocus("email")}
            onBlur={() => handleFocus(null)}
            onChange={handleEmailChange}
          />
        </div>
        <div
          className={`sign__input__wrapper sign__input__wrapper--${focus === "password" ? "outline" : ""}`}
        >
          <FaLock
            className={`sign__input__icon ${baseVerification.password ? "sign__input__icon--ok" : ""}`}
          />
          <input
            type="password"
            placeholder="Password"
            className="sign__input"
            onFocus={() => handleFocus("password")}
            onBlur={() => handleFocus(null)}
            onChange={handlePasswordChange}
          />
        </div>
        <Button
          text="Zaloguj się"
          type="submit"
          className={
            baseVerification.email && baseVerification.password
              ? "button--ok"
              : "button--disabled"
          }
        />
        <a href="" className="sign__goTo">
          Zarejestruj się
        </a>
      </form>
    </div>
  );
};

export default Login;
