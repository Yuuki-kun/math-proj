import React from "react";
import { FaXmark } from "react-icons/fa6";
import { FiMinusCircle } from "react-icons/fi";
import { TiTick } from "react-icons/ti";
import "./pr-e-r.css";
import { Button } from "antd";
const PracticeResult = ({ examData, resultData }) => {
  return (
    <div style={{ padding: "20px" }}>
      <div className="practice-result-container">
        <div className="practice-result-title">
          <h4>Kết quả: {examData?.title}</h4>
        </div>
        <div className="mb-4 mt-2">
          <Button>Xem chi tiết</Button>
        </div>
        <div className="d-flex justify-content-start gap-4">
          <div
            className="practice-result-content"
            style={{
              marginTop: "20px",
              padding: "16px",
              border: "1px solid #e0e0e0",
              borderRadius: "5px",
              backgroundColor: "#f5f5f5",
              fontSize: "16px",
              fontWeight: "450",
            }}
          >
            <div>
              Kết quả: {resultData?.numberOfCorrectAnswer}/
              {resultData?.numberOfCorrectAnswer +
                resultData?.numberOfWrongAnswer +
                resultData?.numberOfNotAnsweredQuestion}
            </div>
            <div>Tổng điểm: {resultData?.totalPoint}</div>
            <div>
              Độ chính xác:{" "}
              {(
                Number(
                  resultData?.numberOfCorrectAnswer /
                    (resultData?.numberOfCorrectAnswer +
                      resultData?.numberOfWrongAnswer +
                      resultData?.numberOfNotAnsweredQuestion)
                ) * 100
              ).toFixed(2)}
              %
            </div>
          </div>
          <div
            className="practice-result-content-detail"
            style={{
              borderColor: "green",
            }}
          >
            <span>
              <TiTick size={22} color="green" />
            </span>
            <span>Số câu đúng</span>
            <span className="mt-2 fs-4">
              {resultData?.numberOfCorrectAnswer}
            </span>
          </div>

          <div
            className="practice-result-content-detail"
            style={{
              borderColor: "red",
            }}
          >
            <span>
              <FaXmark size={22} color="red" />
            </span>
            <span>Số câu sai</span>
            <span className="mt-2 fs-4">{resultData?.numberOfWrongAnswer}</span>
          </div>

          <div className="practice-result-content-detail">
            <span>
              <FiMinusCircle size={22} color="grey" />
            </span>
            <span>Số câu bỏ qua</span>
            <span className="mt-2 fs-4">
              {resultData?.numberOfNotAnsweredQuestion}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeResult;
