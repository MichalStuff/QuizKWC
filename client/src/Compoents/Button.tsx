export type ButtonProps = {
  text?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

const Button = ({ text, className, type = "button", onClick }: ButtonProps) => {
  return (
    <button
      type={type}
      className={`button ${className ? className : ""}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
