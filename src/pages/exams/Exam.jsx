import React, { useEffect, useState } from "react";
import usePrivateRequest from "../../hook/usePrivateRequest";
import DOMPurify from "dompurify";
import "./exam.css";
import { PlusOutlined } from "@ant-design/icons";
import { BsQuestionCircle } from "react-icons/bs";

import useAuth from "../../hook/useAuth";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import FileUploadDialog from "../../component/shared/dialog/FileUploadDialog";
import PreviewQuestion from "./PreviewQuestion";
import { LocalStorage } from "../../utils/LocalStorage";
import { Button } from "antd";
import ExamList from "./ExamList";
import ExamApi from "../../component/api/ExamApi";
const Exam = () => {
  const mathContent = `<p>
  Câu hỏi: y =
  <math xmlns="http://www.w3.org/1998/Math/MathML">
    <msup><mrow><mi>x</mi></mrow><mrow><mn>2</mn></mrow></msup>
  </math>
  -
  <math xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <munderover>
        <mo stretchy="false">∑</mo>
        <mrow><mn>2</mn></mrow>
        <mrow><mn>1</mn></mrow>
      </munderover>
      <mrow><mi>x</mi><mo>-</mo><mn>2</mn></mrow>
    </mrow>
  </math>
  <br />
  hay chon dap an dung
  </p>
`;
  // const [selectedFile, setSelectedFile] = useState(null);
  // const handleFileChange = (event) => {
  //   setSelectedFile(event.target.files[0]);
  // };

  const axiosPrivate = usePrivateRequest();

  const [searchParams] = useSearchParams();
  const [action, setAction] = useState(null);
  const [status, setStatus] = useState(null);

  // const handleFileUpload = async () => {
  //   const formData = new FormData();
  //   formData.append("file", selectedFile);
  //   try {
  //     const response = await axiosPrivate.post(
  //       "teacher/exams/upload",
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );
  //     console.log("File uploaded successfully:", response.data);
  //   } catch (error) {
  //     console.error("Failed to upload file:", error);
  //   }
  // };

  const cleanContent = (content) => DOMPurify.sanitize(content);

  const [examHint, setExamHint] = useState(
    LocalStorage.get("examHint") || false
  );

  const [createExamSelected, SetCreateExamSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [userRole, setUserRole] = useState("anonymous");

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [examStartIn30Minutes, setExamStartIn30Minutes] = useState([]);
  const { auth } = useAuth();

  // useEffect(() => {
  //   if (auth) {
  //     setUserRole(auth.roles);
  //   }
  // }, [auth]);

  const navigate = useNavigate();
  console.log(auth);

  console.log("selectedFile", selectedFile);

  //send file to server
  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    setIsUploading(true);
    try {
      const response = await axiosPrivate.post("exams/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("File uploaded successfully:", response.data);
      // setTimeout(() => {
      //   setIsUploading(false);
      // }, 20000);
      setIsUploading(false);
      if (response.status === 200) {
        setIsPreview(true);
        setExam({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          totalQuestions: response.data.totalQuestions,
        });
        setQuestions(response.data.questions);
        var url = `/exams?action=create&status=preview&id=${response.data.id}`;
        navigate(url);
      }
    } catch (error) {
      console.error("Failed to upload file:", error);
      setIsUploading(false);
    } finally {
      SetCreateExamSelected(false);
    }
  };
  const getMoreQuestion = async (id, currentNumberQuestion) => {
    if (
      !id ||
      currentNumberQuestion <= 0 ||
      currentNumberQuestion >= exam.totalQuestions
    )
      return;
    try {
      const response = await axiosPrivate.get(
        `question/${id}/questions?offset=${currentNumberQuestion}&size=5`
      );
      console.log("response", response);

      //append new questions to the current questions
      setQuestions([...questions, ...response.data]);
    } catch (error) {
      console.error("Failed to get more question:", error);
    }
  };
  console.log("exam", exam);

  const [examList, setExamList] = useState([]);
  const [beginSoonExamList, setBeginSoonExamList] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
  });

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await ExamApi.getExam(axiosPrivate, pagination);
        setExamList(response.data.content);
      } catch (error) {
        console.error("Failed to fetch exam:", error);
      }
    };

    const fetchExamByStudentId = async () => {
      try {
        const response = await ExamApi.getExamByStudentId(
          axiosPrivate,
          pagination,
          auth?.memberId
        );
        setExamList(response.data.content);
      } catch (error) {
        console.error("Failed to fetch exam by student id:", error);
      }
    };

    const fetchBeginSoonExam = async () => {
      try {
        const response = await ExamApi.getExamStartIn30Minutes(axiosPrivate);
        setBeginSoonExamList(response.data);
      } catch (error) {
        console.error("Failed to fetch begin soon exam:", error);
      }
    };

    const fetchBeginSoonExamByStudentId = async () => {
      try {
        const response = await ExamApi.getExamStartIn30MinutesByStudentId(
          axiosPrivate,
          auth?.memberId,
          30
        );
        setBeginSoonExamList(response.data);
      } catch (error) {
        console.error("Failed to fetch begin soon exam:", error);
      }
    };

    if (action === null || action === "" || action === undefined) {
      if (auth?.roles.some((role) => role === "ADMIN")) {
        fetchExam();
        fetchBeginSoonExam();
      } else if (auth?.roles.some((role) => role === "USER")) {
        fetchExamByStudentId();
        fetchBeginSoonExamByStudentId();
      } else {
        setExamList([]);
      }
    }
    console.log("examList", examList);
  }, [action, status]);

  useEffect(() => {
    const action = searchParams.get("action");
    const status = searchParams.get("status");

    const id = searchParams.get("id");

    const fetchExamById = async (id) => {
      try {
        const response = await ExamApi.getExamInfoById(axiosPrivate, id);
        setExam(response.data);
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Failed to fetch exam by id:", error);
      }
    };

    console.log("action", action);
    console.log("id", id);

    if (action === "create" && status === "preview") {
      setIsPreview(true);
    } else if (action === "edit" && id !== null) {
      fetchExamById(id);
    }

    setAction(action);
    setStatus(status);
  }, [searchParams]);

  console.log("action", action);

  return (
    // <>
    //   <div dangerouslySetInnerHTML={{ __html: cleanContent(mathContent) }} />
    // </>
    <div className="common-exam-container">
      <FileUploadDialog
        open={createExamSelected}
        setOpen={SetCreateExamSelected}
        message={"Chọn file đề kiểm tra"}
        handler={handleFileUpload}
        senderName={"admin"}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        isUploading={isUploading}
      />
      {((action === "create" && status === "preview") || action === "edit") &&
      questions.length > 0 ? (
        <div style={{ width: "100%" }}>
          <PreviewQuestion
            questions={questions}
            setQuestions={setQuestions}
            exam={exam}
            setExam={setExam}
          />
          <button onClick={() => getMoreQuestion(exam?.id, questions?.length)}>
            Tải thêm
          </button>
        </div>
      ) : (
        <div className="common-exam-content">
          <div className="exam-head card-fade-in">
            <h1 className="primary-title">Đề kiểm tra</h1>
            {/* <p>{exam?.description}</p> */}
            <button
              title="Hướng dẫn"
              className=""
              style={{
                border: "none",
                borderRadius: "50%",
                backgroundColor: "transparent",
                marginLeft: "auto",
                marginRight: "10px",
                width: "35px",
                height: "35px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span>
                <BsQuestionCircle size={25} color="#000" />
              </span>
            </button>
            {auth?.roles.some((role) => role === "ADMIN") && (
              <button
                className={`a-add-class-btn`}
                onClick={() => SetCreateExamSelected(!createExamSelected)}
                // to={`/exams/create`}
              >
                {<PlusOutlined />}
                <span>{"Tạo đề"}</span>
                <span className="add-class-shortcut">{"N"}</span>
              </button>
            )}
          </div>
        </div>
      )}
      {((action !== null) & (action === "") || action === null) && (
        <div>
          {beginSoonExamList?.length > 0 && (
            <div className="begin-soon-exam-container">
              <h6>Sắp diễn ra</h6>
              <div className="begin-soon-exam-list">
                {beginSoonExamList.map((exam) => (
                  <div key={exam.id} className="begin-soon-exam-item">
                    <div className="begin-soon-exam-title">{exam.title}</div>
                    <div className="begin-soon-exam-date">
                      Bắt đầu: {exam.beginDate}
                    </div>
                    <div className="begin-soon-exam-time">60 phút</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            {examList && examList?.length > 0 && (
              <ExamList examList={examList} roles={auth?.roles} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Exam;
