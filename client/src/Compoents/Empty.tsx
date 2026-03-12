import Truck from "../assets/truck.svg?react";

const Empty = () => {
  return (
    <div className="empty">
      <div className="empty__icon__wrapper">
        <Truck className="empty__icon" />
        <p className="empty__icon__text">EMPTY!</p>
      </div>
      <div className="empty__content">Nic tu nie ma!</div>
    </div>
  );
};

export default Empty;
