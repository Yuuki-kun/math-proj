const QuestionApi = {
  update: (axiosPrivate, question) => {
    return axiosPrivate.put(`question/${question.id}`, question);
  },
};

export default QuestionApi;
