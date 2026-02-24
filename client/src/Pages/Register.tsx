import { FaLock, FaEnvelope, FaUser } from "react-icons/fa";
import Button from "../Compoents/Button";
import { useState } from "react";
import { Link } from "react-router-dom";

type RegisterUser = {
  name?: string;
  email: string;
  password: string;
  repeatPassword: string;
};

const Register = () => {
  const [focus, setfocus] = useState<
    "email" | "password" | "repeatPassword" | "name" | null
  >(null);
  const [baseVerification, setBaseVerification] = useState({
    name: false,
    email: false,
    password: false,
    repeatPassword: false,
  });
  const [user, setUser] = useState<RegisterUser>({
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleFocus = (
    field: "email" | "password" | "repeatPassword" | "name" | null,
  ) => {
    setfocus(field);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, name: e.target.value });
    setBaseVerification((prev) => ({
      ...prev,
      name: checkName(e.target.value),
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, email: e.target.value });
    setBaseVerification((prev) => ({
      ...prev,
      email: checkEmail(e.target.value),
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, password: e.target.value });
    setBaseVerification((prev) => ({
      ...prev,
      password: checkPassword(e.target.value),
      repeatPassword: changeRepeatPassword2(
        user.repeatPassword,
        e.target.value,
      ),
    }));
  };

  const handleRepeatPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUser({ ...user, repeatPassword: e.target.value });
    setBaseVerification((prev) => ({
      ...prev,
      repeatPassword: changeRepeatPassword(e.target.value),
    }));
  };

  const checkEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPassword = (password: string) => {
    return password.length >= 6;
  };
  const changeRepeatPassword = (repeatPassword: string) => {
    return repeatPassword === user.password;
  };
  const changeRepeatPassword2 = (repeatPassword: string, password: string) => {
    return repeatPassword === password;
  };

  const checkName = (name: string) => {
    return name.length >= 3;
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      baseVerification.email &&
      baseVerification.password &&
      baseVerification.repeatPassword
    ) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          confirmPassword: user.repeatPassword,
          name: user.name,
        }),
      };
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      fetch(`${apiUrl}/auth/register`, requestOptions).then((response) =>
        response.json().then((data) => console.log(data)),
      );
    }
  };

  return (
    <div className="sign">
      <form className="sign__form" onSubmit={handleSubmit}>
        <h3
          className={`sign__title ${baseVerification.email && baseVerification.password && baseVerification.repeatPassword ? "sign__title--ok" : ""}`}
        >
          Zarejestruj się
        </h3>
        <div
          className={`sign__input__wrapper sign__input__wrapper--${focus === "name" ? "outline" : ""}`}
        >
          <FaUser
            className={`sign__input__icon ${baseVerification.email ? "sign__input__icon--ok" : ""}`}
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="sign__input"
            onFocus={() => handleFocus("name")}
            onBlur={() => handleFocus(null)}
            onChange={handleNameChange}
          />
        </div>
        <div
          className={`sign__input__wrapper sign__input__wrapper--${focus === "email" ? "outline" : ""}`}
        >
          <FaEnvelope
            className={`sign__input__icon ${baseVerification.email ? "sign__input__icon--ok" : ""}`}
          />
          <input
            type="text"
            name="email"
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
            name="password"
            placeholder="Password"
            className="sign__input"
            onFocus={() => handleFocus("password")}
            onBlur={() => handleFocus(null)}
            onChange={handlePasswordChange}
          />
        </div>
        <div
          className={`sign__input__wrapper sign__input__wrapper--${focus === "repeatPassword" ? "outline" : ""}`}
        >
          <FaLock
            className={`sign__input__icon ${baseVerification.repeatPassword ? "sign__input__icon--ok" : ""}`}
          />
          <input
            type="password"
            name="repeatPassword"
            placeholder="Repeat Password"
            className="sign__input"
            onFocus={() => handleFocus("repeatPassword")}
            onBlur={() => handleFocus(null)}
            onChange={handleRepeatPasswordChange}
          />
        </div>
        <Button
          text="Zarejestruj się"
          type="submit"
          className={
            baseVerification.email &&
            baseVerification.password &&
            baseVerification.repeatPassword
              ? "button--ok"
              : "button--disabled"
          }
        />
        <Link to={"/login"} className="sign__goTo">
          Zaloguj się
        </Link>
      </form>
    </div>
  );
};

export default Register;
