import React, { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ExamApi from "../../../component/api/ExamApi";
import useAxiosPrivate from "../../../hook/usePrivateRequest";
import "./pr-exam.css";
import PraticeExamQuestionSection from "./PracticeExamQuestionSection";
import PracticeExamQuestionSection from "./PracticeExamQuestionSection";
import CountdownTimer from "./CountDownTimer";
import SideQuestionList from "./SideQuestionList";
import CustomRotateZLoader from "../../../component/shared/loading/CustomRotateZLoader";
import PracticeResult from "./PracticeResult";
const ExamPractice = () => {
  const { id } = useParams();

  const [searchParams] = useSearchParams();

  const [practiceExamData, setPracticeExamData] = React.useState(null);

  const [selectedAnswers, setSelectedAnswers] = React.useState({});
  const [flaggedQuestions, setFlaggedQuestions] = React.useState([]);
  //on seconds
  const axiosPrivate = useAxiosPrivate();
  //list of question ref
  const questionRefs = useRef([]);

  const [isSubmit, setIsSubmit] = React.useState(false);

  const selectedAnswersRef = useRef(selectedAnswers);
  const flaggedQuestionsRef = useRef(flaggedQuestions);

  // useEffect(() => {
  //   // selectedAnswersRef.current = selectedAnswers;
  //   // flaggedQuestionsRef.current = flaggedQuestions;

  //   const examInProgress = localStorage.getItem("exam");
  //   if (examInProgress) {
  //     const exam = JSON.parse(examInProgress);
  //     exam.flaggedQuestions = flaggedQuestionsRef.current;
  //     localStorage.setItem("exam", JSON.stringify(exam));
  //   } else {
  //     const examInProgress = {
  //       id,
  //       isSubmit,
  //       selectedAnswers: selectedAnswers,
  //       flaggedQuestions: flaggedQuestions,
  //     };
  //     localStorage.setItem("exam", JSON.stringify(examInProgress));
  //   }
  // }, [selectedAnswers, flaggedQuestions]);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const rs = await ExamApi.getExamInfoById(axiosPrivate, id);
        console.log(rs);

        // const examInProgress = localStorage.getItem("exam");
        // let exam;
        // if (examInProgress) {
        //   exam = JSON.parse(examInProgress);
        //   console.log(exam);
        // }

        // if (
        //   examInProgress &&
        //   exam?.id === id &&
        //   !exam.isSubmit &&
        //   Object.keys(exam.selectedAnswers).length > 0
        // ) {
        //   const confirmed = window.confirm(
        //     "Bạn có bài thi chưa hoàn thành, bạn muốn tiếp tục không?"
        //   );
        //   if (confirmed) {
        //     setFlaggedQuestions(exam.flaggedQuestions);

        //     setSelectedAnswers(exam.selectedAnswers);
        //   } else {
        //   }
        // } else {
        // }

        setPracticeExamData(rs.data);

        questionRefs.current = rs.data.questions.map(
          (_, index) => questionRefs.current[index] ?? React.createRef()
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchExamData();

    // return () => {
    //   if (!isSubmit) {
    //     //save data to local storage
    //     const examInProgress = {
    //       id,
    //       isSubmit,
    //       selectedAnswers: selectedAnswersRef.current,
    //       flaggedQuestions: flaggedQuestionsRef.current,
    //     };
    //     localStorage.setItem("exam", JSON.stringify(examInProgress));
    //   }
    // };
  }, [id]);

  const onSelectedAnswerForQuestion = (questionId, questionIndex, answerId) => {
    console.log(questionIndex, answerId);
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [questionIndex]: { questionId: questionId, answerId: answerId },
    }));

    // const examInProgress = localStorage.getItem("exam");
    // if (examInProgress) {
    //   const exam = JSON.parse(examInProgress);
    //   exam.selectedAnswers = {
    //     ...exam.selectedAnswers,
    //     [questionIndex]: { qid: questionId, aid: answerId },
    //   };
    //   exam.flaggedQuestions = flaggedQuestions;
    //   localStorage.setItem("exam", JSON.stringify(exam));
    // } else {
    //   const examInProgress = {
    //     id,
    //     isSubmit,
    //     selectedAnswers: {
    //       [questionIndex]: { qid: questionId, aid: answerId },
    //     },
    //     flaggedQuestions: flaggedQuestions,
    //   };
    //   localStorage.setItem("exam", JSON.stringify(examInProgress));
    // }
  };

  const onFlaggedQuestion = (questionIndex) => {
    const examInProgress = localStorage.getItem("exam");

    // if (examInProgress) {
    //   const exam = JSON.parse(examInProgress);

    //   if (exam.flaggedQuestions.includes(questionIndex)) {
    //     exam.flaggedQuestions = exam.flaggedQuestions.filter(
    //       (index) => index !== questionIndex
    //     );
    //   } else {
    //     exam.flaggedQuestions = [...exam.flaggedQuestions, questionIndex];
    //   }
    //   exam.selectedAnswers = selectedAnswers;

    //   localStorage.setItem("exam", JSON.stringify(exam));
    // } else {
    //   const examInProgress = {
    //     id,
    //     isSubmit,
    //     selectedAnswers: selectedAnswers,
    //     flaggedQuestions: flaggedQuestions,
    //   };
    //   localStorage.setItem("exam", JSON.stringify(examInProgress));
    // }

    setFlaggedQuestions((prevFlaggedQuestions) => {
      if (prevFlaggedQuestions.includes(questionIndex)) {
        // Nếu đã tồn tại, loại ra
        return prevFlaggedQuestions.filter((index) => index !== questionIndex);
      } else {
        // Nếu chưa tồn tại, thêm vào
        return [...prevFlaggedQuestions, questionIndex];
      }
    });
  };

  const goToQuestion = (questionIndex) => {
    console.log(questionIndex);

    questionRefs.current[questionIndex]?.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  console.log("main=" + flaggedQuestions);

  console.log(selectedAnswers);

  const answerStatusByDefault = (questionIndex, answerId) => {
    if (selectedAnswers[questionIndex]) {
      return selectedAnswers[questionIndex].answerId === answerId;
    }
    return false;
  };

  const checkDefaultStatusFlaggedQuestion = (questionIndex) => {
    return flaggedQuestions.includes(questionIndex);
  };

  const [isSubmitExam, setIsSubmitExam] = React.useState(false);
  const [submitExamResult, setSubmitExamResult] = React.useState(null);
  const [isShowSubmitResult, setIsShowSubmitResult] = React.useState(false);
  const onSubmitExam = async () => {
    setIsSubmitExam(true);

    console.log("submit exam");
    const attemptId = searchParams.get("attempt");

    const newArrayFromSelectedAnswers = Object.values(selectedAnswers);
    const postSubmitExam = {
      examId: id,
      questionAnswerings: newArrayFromSelectedAnswers,
      examAttemptId: attemptId,
    };
    console.log(postSubmitExam);

    try {
      const rs = await ExamApi.submitExam(axiosPrivate, postSubmitExam);
      console.log(rs?.data);
      setSubmitExamResult(rs?.data);
      setIsSubmitExam(false);
      setIsShowSubmitResult(true);
    } catch (error) {
      console.error(error);
      setIsSubmitExam(false);
    }
  };

  return (
    <>
      {isShowSubmitResult ? (
        <PracticeResult
          examData={practiceExamData}
          resultData={submitExamResult}
        />
      ) : (
        <div className="practice-exam-container">
          {isSubmitExam && (
            <CustomRotateZLoader
              content={"Đang nộp..."}
              isLoading={isSubmitExam}
            />
          )}
          <div className="pr-exam-title">{practiceExamData?.title}</div>
          <div className=" pr-exam-content-time-container">
            <div className="pr-exam-area pr-exam-content-container">
              {practiceExamData?.questions.map((question, index) => (
                <PracticeExamQuestionSection
                  qref={questionRefs.current[index]}
                  key={question.id}
                  question={question}
                  qindex={index}
                  onSelectAnswer={onSelectedAnswerForQuestion}
                  onFlaggedQuestion={onFlaggedQuestion}
                  isCheckedDefault={answerStatusByDefault}
                  checkDefaultStatusFlaggedQuestion={
                    checkDefaultStatusFlaggedQuestion
                  }
                />
              ))}
            </div>
            <div className="pr-exam-area pr-exam-time-control">
              <div className="pr-exam-clock">
                <CountdownTimer
                  timeLimit={practiceExamData?.timeLimit}
                  onSubmitExam={onSubmitExam}
                />
                {/* <div className="question-sheet-list">
             
            
            </div> */}
                <SideQuestionList
                  numberOfQuestions={practiceExamData?.questions?.length || 0}
                  selectedAnswers={selectedAnswers}
                  flaggedQuestions={flaggedQuestions}
                  goToQuestion={goToQuestion}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamPractice;
