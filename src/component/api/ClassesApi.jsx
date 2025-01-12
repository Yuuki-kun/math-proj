import { ApiUrl } from "../../config/apiUrl";
import axios from "../../config/axios/axios";

const ClassesApi = {
  addClass: (axiosPrivate, formData) =>
    axiosPrivate.post(ApiUrl.class.teacher.addClass, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getClasses: (axiosPrivate, teacherId, pageSize) =>
    axiosPrivate.get(
      `${ApiUrl.class.teacher.getClassesByTeacherId}/${teacherId}?page=${pageSize.page}&size=${pageSize.size}`
    ),

  getJoinedClasses: (axiosPrivate, studentId, page, size) =>
    axiosPrivate.get(
      `${ApiUrl.class.student.joinedClass}/${studentId}?page=${page}&size=${size}`
    ),

  joinClass: (axiosPrivate, studentId, classId, userId) =>
    axiosPrivate.post(ApiUrl.class.student.joinClass, {
      studentId: studentId,
      classId: classId,
      userId: userId,
    }),
  findByName: (axiosPrivate, name, studentId) =>
    axiosPrivate.get(`${ApiUrl.class.public.findByName}/${name}/${studentId}`),
  findById: (axiosPrivate, id) =>
    axiosPrivate.get(`${ApiUrl.class.public.findById}?classId=${id}`),
  calculateTotalStudent: (axiosPrivate, id) =>
    axiosPrivate.get(`${ApiUrl.class.public.calculateTotalStudent}/${id}`),
};

export default ClassesApi;
