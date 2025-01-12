import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BreadcrumbNavigation from "../../component/shared/BreadcrumbNavigation";
import "./exam-info.css";
import { use } from "react";
import ExamApi from "../../component/api/ExamApi";
import usePrivateRequest from "../../hook/usePrivateRequest";
import { GoClock } from "react-icons/go";
import { LuClock4 } from "react-icons/lu";

import DOMPurify from "dompurify";
import { BiEditAlt } from "react-icons/bi";

const ExamInfo = () => {
  //get query params
  const [searchParams] = useSearchParams();

  const [examId, setExamId] = useState(null);

  const [examInfo, setExamInfo] = useState(null);

  const axiosPrivate = usePrivateRequest();

  useEffect(() => {
    const examId = searchParams.get("id");
    setExamId(examId);
  }, [searchParams]);

  useEffect(() => {
    const fetchExamInfo = async () => {
      if (examId) {
        //fetch exam info

        try {
          const rs = await ExamApi.getExamInfoById(axiosPrivate, examId);
          if (rs && rs.data && rs.status === 200) {
            setExamInfo(rs.data);
          }
          console.log("rs", rs);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchExamInfo();
  }, [examId]);

  const breadcrumbItems = [
    {
      title: "Exam",
      href: "/#/exams",
    },
    {
      title: `${examInfo?.title}` || "Unknown",
    },
  ];

  const cleanContent = (content) => DOMPurify.sanitize(content);

  return (
    <div className="exam-info-container">
      <div className="exam-info-breadcrumb-container card-fade-in">
        <BreadcrumbNavigation items={breadcrumbItems} />
        <Link className="edit-exam-link" to={`/exams?action=edit&id=${examId}`}>
          <span>Chỉnh sửa</span>
          <BiEditAlt size={22} />
        </Link>
      </div>
      <div className="exam-info-title-container">
        {/* title, description, time limit, question types, total questions, average point, note */}
        <div className="exam-info-content card-fade-in">
          <div className="exam-info-item mb-4">
            <div className="primary-title exam-info-item-content">
              {examInfo?.title}
            </div>
          </div>
          <div className="exam-info-item">
            <div className="exam-info-item-content">
              {examInfo?.description}
            </div>
          </div>
          <div className="exam-info-item">
            <div className="exam-info-item-title">
              <LuClock4 size={18} />
              <span>Thời gian làm bài</span>
            </div>
            <div className="exam-info-item-content time-limit">
              {" "}
              {examInfo?.timeLimit} phút
            </div>
          </div>
          <div className="exam-info-item">
            <div className="exam-info-item-title">Số câu hỏi</div>
            <div className="exam-info-item-content">
              {examInfo?.questions?.length}
            </div>
            {/*  */}
          </div>
          <div className="exam-info-item">
            <div className="exam-info-item-content">
              {examInfo?.questionTypes}
            </div>
          </div>

          <div className="exam-info-item">
            <div className="exam-info-item-content">
              {examInfo?.averagePoint}
            </div>
          </div>
          <div
            className="exam-info-item"
            style={{
              fontStyle: "italic",
              color: "red",
              fontSize: "15px",
            }}
          >
            <div className="exam-info-item-title">Lưu ý:</div>
            <div className="exam-info-item-content">{examInfo?.note}</div>
          </div>
        </div>
      </div>
      <div className="exam-info-question-container mt-4">
        {examInfo?.questions?.map((question, index) => (
          <div className="exam-info-question-item card-enter" key={index}>
            <div className="e-i-question-section">
              <span className="e-i-q-title">Câu {index + 1}</span>
              <div
                className="e-i-q-content"
                dangerouslySetInnerHTML={{
                  __html: cleanContent(question.title),
                }}
              ></div>
            </div>
            <div className="e-i-answer-section">
              {question?.answers?.map((answer, index) => (
                <div className="e-i-answer-item" key={index}>
                  <div
                    className={`e-i-a-title ${
                      answer?.correct ? "correct" : ""
                    }`}
                  >
                    <span>{answer?.letter}</span>
                  </div>
                  <div
                    className="answer-content"
                    dangerouslySetInnerHTML={{
                      __html: cleanContent(answer?.content),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamInfo;
