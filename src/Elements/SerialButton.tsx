import React from "react";
import buzzerServices from "../services/buzzerServices";
import gamesServices from "../services/gamesServices";

export const SerialButton: React.FC = () => {
  const { uid } = gamesServices.useGame();
  const leader = gamesServices.useLeader();
  const connected = buzzerServices.useConnected();
  if (connected || !leader) return null;
  return (
    <button
      type="button"
      className="serial-button"
      onClick={() => buzzerServices.connect(uid)}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/67/USB_icon.svg"
        alt="USB"
      />
    </button>
  );
};
