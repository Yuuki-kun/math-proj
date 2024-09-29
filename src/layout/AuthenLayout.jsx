import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import "./style.css";

const symbols = ["∑", "π", "√", "∞", "∫", "∆", "∇", "≠", "≈", "∴"];

const AuthenLayout = () => {
  const bgRef = useRef(null);
  useEffect(() => {
    const interval = setInterval(createFallingSymbol, 1000);

    return () => clearInterval(interval); // Cleanup khi component bị hủy
  }, []);

  const createFallingSymbol = () => {
    const symbol = document.createElement("div");

    symbol.classList.add("math-symbol");

    symbol.innerText = symbols[Math.floor(Math.random() * symbols.length)];

    // symbol.innerText = symbols[Math.floor(Math.random() * symbols.length)];

    symbol.style.left = Math.random() * window.innerWidth * 2 + "px";
    symbol.style.animationDuration = 5 + Math.random() * 3 + "s"; // Tốc độ ngẫu nhiên

    const handleMouseOver = () => {
      symbol.style.animationPlayState = "paused"; // Dừng hoạt động rơi
    };

    const handleMouseOut = () => {
      symbol.style.animationPlayState = "running"; // Tiếp tục hoạt động rơi
    };

    symbol.addEventListener("mouseover", handleMouseOver);
    symbol.addEventListener("mouseout", handleMouseOut);

    if (bgRef.current) {
      bgRef.current.appendChild(symbol); // Thêm vào phần tử auth-bg-id
    }

    setTimeout(() => {
      //clean up
      symbol.removeEventListener("mouseover", handleMouseOver);
      symbol.removeEventListener("mouseout", handleMouseOut);
      symbol.remove();
    }, 10000); // Xóa ký hiệu sau 5s
  };
  return (
    <div
      ref={bgRef}
      id="auth-bg-id"
      className="w-100 h-100 p-4 d-flex align-items-center flex-column auth-bg"
    >
      <Outlet />
    </div>
  );
};

export default AuthenLayout;
