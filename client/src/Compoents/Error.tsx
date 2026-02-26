import Truck from "../assets/truck.svg?react";

export type ErrorProps = {
  message?: string;
};

const Error = ({ message }: ErrorProps) => {
  return (
    <div className="error">
      <div className="error__icon__wrapper">
        <Truck className="error__icon" />
        <p className="error__icon__text">ERROR!</p>
      </div>
      <div className="error__content">Coś poszło nie tak!</div>
      <div className="error__content">{message}</div>
    </div>
  );
};

export default Error;
