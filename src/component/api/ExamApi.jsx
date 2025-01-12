import { ApiUrl } from "../../config/apiUrl";
import { axiosPrivate } from "../../config/axios/axiosPrivate";

const ExamApi = {
  getExam: (axiosPrivate, pagination) => {
    if (!pagination) {
      pagination = {
        page: 1,
        size: 5,
      };
    }
    return axiosPrivate.get(
      `${ApiUrl.exam.getExam}?page=${pagination.page}&size=${pagination.size}`
    );
  },
  getExamByStudentId: (axiosPrivate, pagination, studentId) => {
    if (!pagination) {
      pagination = {
        page: 1,
        size: 5,
      };
    }
    return axiosPrivate.get(
      `${ApiUrl.exam.getExamByStudentId}/${studentId}?page=${pagination.page}&size=${pagination.size}`
    );
  },
  getExamStartIn30Minutes: (axiosPrivate) => {
    return axiosPrivate.get(`${ApiUrl.exam.getExamStartIn30Minutes}`);
  },
  getExamStartIn30MinutesByStudentId: (axiosPrivate, studentId, minutes) => {
    return axiosPrivate.get(
      `${ApiUrl.exam.getExamStartIn30MinutesByStudentId}/${studentId}/${minutes}`
    );
  },
  getExamInfoById: (axiosPrivate, id) => {
    return axiosPrivate.get(`${ApiUrl.exam.getExamInfoById}/${id}`);
  },

  updateExamInfo: (axiosPrivate, exam, id) => {
    return axiosPrivate.put(`${ApiUrl.exam.update}/${id}`, exam);
  },
  startExamAttemptApi: (axiosPrivate, studentId, examId) => {
    return axiosPrivate.post(
      `${ApiUrl.exam.startExamAttempt}/${examId}/${studentId}`
    );
  },

  submitExam: (axiosPrivate, postSubmitExam) => {
    return axiosPrivate.post(
      `${ApiUrl.examAttempt.submitExam}`,
      postSubmitExam
    );
  },
};

export default ExamApi;
