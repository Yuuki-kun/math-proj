import React from "react";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Result, Typography } from "antd";
const { Paragraph, Text } = Typography;
const FeedBackFailed = ({
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
        <Button type="primary" key="confirm" onClick={() => closeModal()}>
          Đóng,
        </Button>,
        <Button key="confirm" onClick={() => continueFunction()}>
          Tiếp tục tạo lớp
        </Button>,
      ]}
      style={{}}
    >
      {/* <div className="desc">
        <Paragraph>
          <Text
            strong
            style={{
              fontSize: 16,
            }}
          >
            The content you submitted has the following error:
          </Text>
        </Paragraph>
        <Paragraph>
          <CloseCircleOutlined className="site-result-demo-error-icon" /> Your
          account has been frozen. <a>Thaw immediately &gt;</a>
        </Paragraph>
        <Paragraph>
          <CloseCircleOutlined className="site-result-demo-error-icon" /> Your
          account is not yet eligible to apply. <a>Apply Unlock &gt;</a>
        </Paragraph>
      </div> */}
    </Result>
  );
};

export default FeedBackFailed;
