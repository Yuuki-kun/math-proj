import { Button, Modal } from "antd";
import React, { useEffect } from "react";
import "./confirmDialog.css";
import { CloseOutlined } from "@ant-design/icons";
import { use } from "react";
import NotificationFooterBasedOnType from "./NotificationFooterBasedOnType";
const ConfirmDialog = ({
  open,
  setOpen,
  message,
  senderName,
  handleAccept,
  selectedNotificationId,
  isHandling,
  type,
  processed,
}) => {
  const [actionResult, setActionResult] = React.useState(null);
  const handleCancel = () => {
    console.log("Clicked cancel button");
    //reset component data
    setActionResult(null);
    setOpen(false);
  };
  const handleAcceptRQ = () => {
    console.log("Clicked accept button");
    const rs = handleAccept(selectedNotificationId);
    setActionResult(rs);
  };

  let title = "Thông báo";
  if (type === "INFORMATION") {
    title = "Thông báo";
  } else if (type === "CONFIRM_JOIN_CLASS") {
    title = "Xác nhận tham gia lớp học";
  } else if (type === "CONFIRM_BEFORE_ACTION") {
    title = "Xác nhận";
  }

  const [notifiFooterType, setNotifiFooterType] = React.useState("information");

  useEffect(() => {
    if (type === "CONFIRM_JOIN_CLASS") {
      setNotifiFooterType("confirmation");
    } else if (type === "CONFIRM_BEFORE_ACTION") {
      setNotifiFooterType("confirm_before_action");
    } else {
      setNotifiFooterType("information");
    }
    if (processed) {
      setNotifiFooterType("information");
    }
  }, [type]);

  return (
    <>
      <Modal
        title={title}
        open={open}
        // confirmLoading={confirmLoading}
        onCancel={() => handleCancel()}
        onClose={() => handleCancel()}
        closable
        closeIcon={<CloseOutlined style={{ color: "red" }} />}
        style={{
          maxWidth: "600px",
        }}
        footer={() => (
          <>
            <NotificationFooterBasedOnType
              type={notifiFooterType}
              handleCancel={handleCancel}
              handleAccept={handleAcceptRQ}
            />
          </>
        )}
      >
        <div>
          <div className="notification-sender-name">{senderName}</div>
          <p>{message}</p>
          {processed && <b>{processed ? "Đã xử lý xong" : "Thất bại"}</b>}

          {notifiFooterType.includes("confirm") && actionResult && (
            <>
              <b>{actionResult ? "Đã xử lý xong" : "Thất bại"}</b>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ConfirmDialog;
