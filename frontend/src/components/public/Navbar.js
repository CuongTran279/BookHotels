import React from "react";

const Navbar = () => {
  return (
    <nav>
      <ul className="grid grid-flow-col gap-7 font-sans">
        <li className="hover:text-sky-400 ease-in-out duration-300">
          <a href="/">Trang chủ</a>
        </li>
        <li className="hover:text-sky-400 ease-in-out duration-300">
          <a href="/">Khách sạn</a>
        </li>
        <li className="hover:text-sky-400 ease-in-out duration-300">
          <a href="/">Liên hệ</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
