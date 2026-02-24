const Loading = () => {
  return (
    <div className="loading">
      <div className="loading__wrapper">
        <svg
          viewBox="0 0 512 200"
          className="loading__icon loading__icon--top"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M48 48a48 48 0 1 0 48 48 48 48 0 0 0-48-48z"
            fill="currentColor"
          />
          <path
            d="M496 64H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16z"
            fill="currentColor"
          />
        </svg>
        <svg
          viewBox="0 0 512 200"
          className="loading__icon loading__icon--middle"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M48 48a48 48 0 1 0 48 48 48 48 0 0 0-48-48z"
            fill="currentColor"
          />
          <path
            d="M496 64H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16z"
            fill="currentColor"
          />
        </svg>
        <svg
          viewBox="0 0 512 200"
          className="loading__icon loading__icon--bottom"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M48 48a48 48 0 1 0 48 48 48 48 0 0 0-48-48z"
            fill="currentColor"
          />
          <path
            d="M496 64H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

export default Loading;
