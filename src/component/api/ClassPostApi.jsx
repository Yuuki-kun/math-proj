import { ApiUrl } from "../../config/apiUrl";

const ClassPostApi = {
  getPosts: (axiosPrivate, classId, pagination) => {
    if (!pagination) {
      pagination = {
        page: 1,
        size: 2,
      };
    }
    return axiosPrivate.get(
      `${ApiUrl.classPost.getPosts}/${classId}?page=${pagination.page}&size=${pagination.size}`
    );
  },
  createPost: (axiosPrivate, post) => {
    return axiosPrivate.post(`${ApiUrl.classPost.classPost}`, post, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default ClassPostApi;
