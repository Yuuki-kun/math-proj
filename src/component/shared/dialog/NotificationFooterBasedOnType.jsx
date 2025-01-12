import { Button } from "antd";
import React from "react";

const NotificationFooterBasedOnType = ({
  type,
  handleAccept,
  handleCancel,
  isHandling,
}) => {
  console.log("type=" + type);

  return (
    <>
      {type === "confirm_before_action" && (
        <>
          <Button type="link" onClick={() => handleCancel()}>
            Đóng
          </Button>
          <Button
            type="primary"
            onClick={() => handleAccept()}
            loading={isHandling}
          >
            Bắt đầu
          </Button>
        </>
      )}
      {type === "information" && (
        <>
          <Button type="link" onClick={() => handleCancel()}>
            Đóng
          </Button>
        </>
      )}

      {type === "confirmation" && (
        <>
          <Button type="link" onClick={() => handleCancel()}>
            Đóng
          </Button>
          <Button type="">Từ chối</Button>
          <Button
            type="primary"
            onClick={() => handleAccept()}
            loading={isHandling}
          >
            Chấp nhận
          </Button>
        </>
      )}
    </>
  );
};

export default NotificationFooterBasedOnType;
