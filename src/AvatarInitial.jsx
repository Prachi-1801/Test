import React from "react";
import "./Models/CSS/AvatarInitial.css";

const AvatarInitial = ({ initial }) => {
  return (
    <div className="avatar-circle">
      <span className="avatar-letter">{initial.toUpperCase()}</span>
    </div>
  );
};

export default AvatarInitial;
