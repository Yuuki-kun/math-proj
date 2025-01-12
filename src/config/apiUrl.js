import { notification } from "antd";

export const ApiUrl = {
  auth: {
    login: "/authentication/authenticate",
    register: "/authentication/register",
    refreshToken: "/authentication/refresh-token",
  },
  class: {
    public: {
      getClasses: "test/test-api-find-all",
      findByName: "classes/class-name",
      findById: "classes",
      calculateTotalStudent: "student/enrollment/count-student",
    },
    teacher: {
      addClass: "classes",
      getClassesByTeacherId: "classes/teacher",
    },
    student: {
      joinedClass: "classes/student",
      joinClass: "student/enrollment/enroll",
    },
  },
  classPost: {
    getPosts: "class-posts/class",
    classPost: "class-posts",
  },
  notification: {
    getNotifications: "notifications",
    handleNotification: "notifications/handle",
    markAsRead: "notifications/read",
  },
  exam: {
    getExam: "exams",
    getExamByStudentId: "exams/student",
    getExamStartIn30Minutes: "exams/starting-soon",
    getExamStartIn30MinutesByStudentId: "exams/student/starting-soon",
    getExamInfoById: "exams/exam",
    update: "exams/exam",
    startExamAttempt: "exams/student/start",
  },
  examAttempt: {
    submitExam: "examAttempt/student/submit",
  },
};
