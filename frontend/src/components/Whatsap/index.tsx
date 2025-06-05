import React from "react";
import style from "./style.module.sass";

interface Prop {
  phoneNumber: string;
  message: string;
}

const WhatsAppFloat: React.FC<Prop> = ({ phoneNumber, message }) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      className={style.whatsapp}
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg"
        alt="WhatsApp"
      />
    </a>
  );
};

export default WhatsAppFloat;
