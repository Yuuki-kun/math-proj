import React from "react";
import { Button, Result } from "antd";

const FeedbackSuccess = ({
  status,
  title,
  subTitle,
  closeModal,
  continueFunction,
}) => {
  return (
    <Result
      status={status}
      title={title}
      subTitle={subTitle}
      extra={[
        <Button type="primary" key="close" onClick={() => closeModal()}>
          Đóng
        </Button>,
        <Button key="continue" onClick={() => continueFunction()}>
          Tiếp tục tạo lớp
        </Button>,
      ]}
    />
  );
};

export default FeedbackSuccess;
