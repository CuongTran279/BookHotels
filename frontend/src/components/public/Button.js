import React, { memo } from "react";

const Button = ({
  text,
  textColor,
  bgColor,
  outline,
  hoverBg,
  hoverText,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ease-in duration-300 outline rounded-sm p-2 outline-1 ${hoverBg} ${hoverText} ${textColor} ${bgColor} ${outline}`}
    >
      {text}
    </button>
  );
};

export default memo(Button);
