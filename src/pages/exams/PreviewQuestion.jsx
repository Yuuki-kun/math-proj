import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import "./preview-question.css";
import { PiFileAudioFill, PiListChecksFill } from "react-icons/pi";
import {
  IoInformationCircleOutline,
  IoSaveSharp,
  IoSettingsOutline,
} from "react-icons/io5";
import dayjs from "dayjs";

import { Button, DatePicker } from "antd";
import { CiEdit } from "react-icons/ci";
import QuestionApi from "../../component/api/QuestionApi";
import usePrivateRequest from "../../hook/usePrivateRequest";
import { RiArrowDropDownLine } from "react-icons/ri";
import DateTimePicker from "../../component/shared/picker/DateTimePicker";
import { AiOutlineCheck } from "react-icons/ai";
import ExamApi from "../../component/api/ExamApi";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";

import ClassesApi from "../../component/api/ClassesApi";
import useAuth from "../../hook/useAuth";
import { IoIosSearch } from "react-icons/io";

const PreviewQuestion = ({ questions = [], setQuestions, exam, setExam }) => {
  const cleanContent = (content) => DOMPurify.sanitize(content);
  const [isSelectedNumber, setIsSelectedNumber] = useState(-1);

  const [isSavedOptions, setIsSavedOptions] = useState(null);
  const [isSavingOptions, setIsSavingOptions] = useState(false);
  const [onEditExamOptions, setOnEditExamOptions] = useState(false);

  const [onEditExamTitle, setOnEditExamTitle] = useState(false);
  const [onEditDescription, setOnEditDescription] = useState(false);
  const [onAssignedClassEdit, setOnAssignedClassEdit] = useState(false);

  const [classes, setClasses] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
    page: 0,
    size: 10,
  });

  const [listOfChangedQuestions, setListOfChangedQuestions] = useState([]);

  const updateCorrectAnswerForIndex = (index, targetAnswerId) => {
    // Tạo bản sao của danh sách questions
    const updatedQuestions = [...questions];

    // Lấy câu hỏi cần cập nhật
    const questionToUpdate = { ...updatedQuestions[index] };

    // Cập nhật danh sách answers của câu hỏi
    questionToUpdate.answers = questionToUpdate.answers.map((answer) => ({
      ...answer,
      correct: answer.id === targetAnswerId, // Cập nhật `correct`
    }));

    // Gán lại câu hỏi đã cập nhật
    updatedQuestions[index] = questionToUpdate;

    // Cập nhật state
    questionToUpdate.changed = true;
    questionToUpdate.saved = false;
    setQuestions(updatedQuestions);
  };

  const updateQuestionFieldAtIndex = (index, event) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [event.target.name]: event.target.value,
    };
    updatedQuestions[index].changed = true;
    updatedQuestions[index].saved = false;
    setQuestions(updatedQuestions);
  };

  const axiosPrivate = usePrivateRequest();
  const { auth } = useAuth();

  const updateQuestion = async (index) => {
    const question = questions[index];
    console.log("question", question);
    question.updating = true;
    setQuestions([...questions]);
    try {
      const rs = await QuestionApi.update(axiosPrivate, question);
      console.log("rs", rs);
      if (rs.status === 200) {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = {
          ...updatedQuestions[index],
        };
        updatedQuestions[index].saved = true;
        updatedQuestions[index].changed = null;
        updatedQuestions[index].updating = null;
        setQuestions(updatedQuestions);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateExamInfo = async () => {
    setIsSavingOptions(true);
    try {
      const rs = await ExamApi.updateExamInfo(axiosPrivate, exam, exam?.id);
      console.log("rs", rs);
      if (rs.data > 0) {
        setIsSavedOptions(true);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsSavingOptions(false);
    }
  };
  console.log("exam", exam);

  const updateExamInfoField = (event) => {
    setIsSavedOptions(false);
    setExam({ ...exam, [event.target.name]: event.target.value });
  };

  // useEffect(() => {
  //   console.log("questions", questions);
  // }, []);

  const openSelectAssignedClass = async () => {
    setOnAssignedClassEdit(!onAssignedClassEdit);
    if (!onAssignedClassEdit) {
      try {
        const classesResponse = await ClassesApi.getClasses(
          axiosPrivate,
          auth?.memberId,
          {
            page: classes.page,
            size: classes.size,
          }
        );
        console.log("classesResponse", classesResponse);

        if (classesResponse.status === 200) {
          setClasses({
            content: classesResponse.data.content,
            totalPages: classesResponse.data.totalPages,
            totalElements: classesResponse.data.totalElements,
            page: classesResponse.data.pageable.pageNumber,
            size: classesResponse.data.pageable.pageSize,
          });
        }
      } catch (error) {
        console.error("error", error);
      }
    }
  };

  return (
    <div className="preview-questions-container">
      <div className="text-center mb-4 card-fade-in">
        <div className="exam-title">
          {onEditExamTitle ? (
            <input
              name="title"
              className="exam-title-input form-control"
              type="text"
              value={exam?.title}
              onChange={(e) => updateExamInfoField(e)}
              onBlur={() => setOnEditExamTitle(false)}
              autoFocus
            />
          ) : (
            <h1 className="primary-title text-center mb-2 mt-2">
              {exam?.title ? exam.title : "The exam has not been named yet"}
            </h1>
          )}
          <button
            className="edit-exam-title-btn"
            onClick={() => {
              setOnEditExamTitle(true);
            }}
          >
            <CiEdit size={24} />
          </button>
        </div>
        <div className="exam-description">
          {onEditDescription ? (
            <textarea
              name="description"
              className="exam-description-input form-control"
              value={exam?.description || ""}
              onChange={(e) => updateExamInfoField(e)}
              onBlur={() => setOnEditDescription(false)}
              autoFocus
            />
          ) : (
            <p className="mb-0">
              {exam?.description ? exam.description : "Nhập mô tả"}
            </p>
          )}
          <button
            className="edit-exam-title-btn"
            onClick={() => {
              if (!onEditDescription) {
                setOnEditDescription(true);
              }
            }}
          >
            <CiEdit size={18} />
          </button>
        </div>
      </div>
      <div className="exam-setting card-enter mb-4">
        <div
          style={{
            marginBottom: 10,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setOnEditExamOptions(!onEditExamOptions)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 550,
              backgroundColor: "transparent",
              paddingLeft: 0,
              border: "none",
            }}
            className="exam-setting-btn"
          >
            <span
              className={`exam-setting-icon ${onEditExamOptions ? "open" : ""}`}
            >
              <IoSettingsOutline size={20} />
            </span>
            <span>Tùy chỉnh</span>
            <span
              style={{
                width: 20,
                height: 20,
              }}
              className={`exam-setting-icon ${onEditExamOptions ? "open" : ""}`}
            >
              <RiArrowDropDownLine size={20} />
            </span>
          </button>
          {isSavedOptions !== null && (
            <span
              style={{
                marginLeft: 10,
                color: isSavedOptions ? "green" : "red",
                fontStyle: "italic",
              }}
            >
              {isSavedOptions ? <AiOutlineCheck size={26} /> : "Chưa được lưu"}
            </span>
          )}
        </div>
        <div
          className={`edit-exam-options-container ${
            onEditExamOptions ? "open" : ""
          }`}
        >
          <div className="e-option-item">
            <span>Lớp học: </span>

            <button
              style={{
                color: exam?.assignedClassName !== null ? "blue" : "red",
                fontStyle: "italic",
                border: "none",
                backgroundColor: "transparent",
                textDecoration: "underline",
                fontWeight: 550,
              }}
              onClick={() => openSelectAssignedClass()}
            >
              {exam?.assignedClassName || "Chọn lớp"}
            </button>

            <div
              className={`e-o-classes-container ${
                onAssignedClassEdit ? "open" : ""
              }`}
            >
              <div className="e-o-search">
                <input type="text" placeholder="Tìm kiếm lớp" />
                <button>
                  <IoIosSearch size={20} />
                </button>
              </div>
              <div className="e-o-classes">
                {classes?.content?.map((classItem) => (
                  <div
                    className="e-o-class-item"
                    onClick={() => {
                      setExam({
                        ...exam,
                        assignedClassId: classItem.id,
                        assignedClassName: classItem.className,
                      });
                      setOnAssignedClassEdit(false);
                    }}
                  >
                    <span>{classItem.className}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="e-option-item">
            <span>Loại: </span>
            <select
              name="examType"
              id="examType"
              className="form-control"
              style={{
                display: "inline-block",
                width: 100,
                padding: "4px 10px",
              }}
              value={exam?.examType || "PRACTICE"}
              onChange={(e) => updateExamInfoField(e)}
            >
              <option value="PRACTICE">Luyện tập</option>
              <option value="EXAM">Bài thi</option>
            </select>
          </div>
          <div className="e-option-item">
            <span>Thời gian (phút): </span>
            <input
              name="timeLimit"
              type="number"
              className="form-control"
              min={1}
              style={{
                width: 100,
                padding: "4px 10px",
                display: "inline-block",
              }}
              value={exam?.timeLimit}
              onChange={(e) => updateExamInfoField(e)}
            />
          </div>
          <div className="e-option-item">
            <span>Ngày bắt đầu: </span>
            <DatePicker
              name="startDate"
              placeholder={"Ngày bắt đầu"}
              showTime
              onChange={(value, dateString) => {
                setIsSavedOptions(false);
                setExam({ ...exam, startDate: value });
              }}
              value={exam?.startDate ? dayjs(exam.startDate) : null}
            />{" "}
          </div>

          <div className="e-option-item">
            <span>Hạn chót: </span>
            <DatePicker
              name="endDate"
              placeholder={"Có thể để trống"}
              showTime
              onChange={(value, dateString) => {
                setIsSavedOptions(false);
                setExam({ ...exam, endDate: value });
              }}
              value={exam?.endDate ? dayjs(exam.endDate) : null}
            />
          </div>

          <div className="e-option-item">
            <span>Số lần thử lại: </span>
            <input
              placeholder="999"
              name="retakeLimit"
              type="number"
              className="form-control"
              min={0}
              max={999}
              style={{
                width: 100,
                padding: "4px 10px",
                display: "inline-block",
              }}
              value={exam?.retakeLimit}
              onChange={(e) => updateExamInfoField(e)}
            />
            <span className="note-information ms-2">
              <IoInformationCircleOutline size={18} />
              <span
                style={{
                  marginLeft: 2,
                }}
              >
                Để trống nếu không giới hạn
              </span>
            </span>
          </div>
          <div className="e-option-item">
            <span>Tự đóng sau (phút): </span>
            <input
              name="autoCloseAfter"
              type="number"
              className="form-control"
              min={1}
              style={{
                width: 100,
                padding: "4px 10px",
                display: "inline-block",
              }}
              value={exam?.autoCloseAfter}
              onChange={(e) => updateExamInfoField(e)}
            />
          </div>
          <button
            className="save-exam-options-btn"
            onClick={() => {
              if (isSavedOptions || isSavingOptions) return;
              updateExamInfo();
            }}
            style={{
              width: "auto",
            }}
            disabled={isSavedOptions || isSavingOptions}
          >
            {isSavingOptions ? (
              <LoadingOutlined color="white" size={20} />
            ) : (
              <IoSaveSharp size={20} />
            )}
            <span>{isSavedOptions ? "Nothing changes" : "Lưu"}</span>
          </button>
        </div>
      </div>
      <div
        className="card-fade-in"
        style={{
          fontSize: 18,
          fontWeight: 550,
          marginBottom: 16,
        }}
      >
        <span>
          <PiListChecksFill size={22} />
        </span>{" "}
        Danh sách câu hỏi
      </div>
      {questions?.map((question, qindex) => {
        if (!question) {
          console.warn(`Question at index ${qindex} is invalid:`, question);
          return null; // Bỏ qua phần tử không hợp lệ
        }
        return (
          <>
            <div
              key={qindex}
              className={`question card-enter ${
                isSelectedNumber === qindex ? "selectedQ" : ""
              }`}
              onClick={() => {
                setIsSelectedNumber(qindex);
                console.log(question);
              }}
            >
              <div className="question-title">
                <span className="question-number">Câu {qindex + 1}</span>
                <span className="question-points">
                  <input
                    disabled={question?.updating}
                    name="point"
                    type="text"
                    value={question?.point}
                    placeholder="Nhập điểm"
                    onChange={(e) => updateQuestionFieldAtIndex(qindex, e)}
                  />
                  điểm
                </span>
                {/* <span className="question-audio">
                {" "}
                <PiFileAudioFill fontSize={22} />
              </span> */}

                <span className="question-level">
                  <select
                    name="level"
                    id=""
                    disabled={question?.updating}
                    defaultValue={question?.level || 1}
                    onChange={(e) => updateQuestionFieldAtIndex(qindex, e)}
                  >
                    <option value="1">Dễ</option>
                    <option value="2">Trung bình</option>
                    <option value="3">Khó</option>
                  </select>
                </span>
                <span className="question-type">
                  <select
                    name="type"
                    id=""
                    defaultValue={question?.type || "Trắc nghiệm"}
                    onChange={(e) => updateQuestionFieldAtIndex(qindex, e)}
                    disabled={question?.updating}
                  >
                    <option value="Trắc nghiệm">Trắc nghiệm</option>
                    <option value="Tự luận">Tự luận</option>
                  </select>
                </span>

                <Button
                  className="save-changes-btn"
                  title="Save changes"
                  onClick={() => updateQuestion(qindex)}
                  disabled={question?.updating}
                >
                  <IoSaveSharp fontSize={22} />
                </Button>
                {!question.updating &&
                  question.saved !== null &&
                  question.changed == null &&
                  question.saved && (
                    <span style={{ color: "green", fontSize: 18 }}>
                      <CheckOutlined
                        size={18}
                        style={{ color: "green !important" }}
                      />
                    </span>
                  )}
                {!question.updating &&
                  question.changed &&
                  !question.saved &&
                  "Chưa lưu"}
                {question.updating && (
                  <span
                    style={{
                      fontSize: 18,
                    }}
                  >
                    <LoadingOutlined size={18} />
                  </span>
                )}
              </div>

              <div
                className="question-content"
                dangerouslySetInnerHTML={{
                  __html: cleanContent(question.title),
                }}
              />

              {question?.answers?.map((answer, aindex) => (
                <div className="answer">
                  <div
                    className={`${
                      question?.updating ? "disabled" : ""
                    } answer-letter ${answer?.correct ? "correct" : ""}`}
                    onClick={() =>
                      updateCorrectAnswerForIndex(qindex, answer.id)
                    }
                  >
                    {/* <span>{String.fromCharCode(65 + aindex)}</span> */}
                    <span>{answer.letter}</span>
                  </div>
                  <div
                    className="answer-content"
                    dangerouslySetInnerHTML={{
                      __html: cleanContent(answer.content),
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        );
      })}
    </div>
  );
};

export default PreviewQuestion;
