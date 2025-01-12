import React, { useState, useEffect, useRef } from "react";
import "./timer.css";
import { LuAlarmClock } from "react-icons/lu";
const CountdownTimer = ({ timeLimit, onSubmitExam }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60 || 0); // 30 phút = 30 * 60 giây
  const timeLeftRef = useRef(timeLeft); // Tạo ref để lưu giá trị

  useEffect(() => {
    setTimeLeft(timeLimit * 60);
    timeLeftRef.current = timeLimit * 60;

    const interval = setInterval(() => {
      if (timeLeftRef.current === 0) {
        // onSubmitExam();
        clearInterval(interval);
      } else {
        setTimeLeft((prevTime) => {
          const newTime = prevTime > 0 ? prevTime - 1 : 0;
          timeLeftRef.current = newTime; // Cập nhật ref
          return newTime;
        });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    }; // Xóa bộ đếm khi component bị huỷ
  }, [timeLimit]);

  //   useEffect(()=>{

  //   },[])

  // Chuyển đổi giây thành phút và giây
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="timer-container">
      <div
        style={{
          fontSize: "30px",
          fontWeight: "bold",
          color: "#ff4d4d",
          background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <LuAlarmClock />
        <span>{formatTime(timeLeft)}</span>
      </div>
      <button className="submit-exam-btn" onClick={() => onSubmitExam()}>
        Nộp bài
      </button>
    </div>
  );
};

export default CountdownTimer;
