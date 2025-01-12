import { Button, Modal } from "antd";
import React from "react";
import CustomRotateZLoader from "../loading/CustomRotateZLoader";

const FileUploadDialog = ({
  open,
  setOpen,
  message,
  handler,
  assignmentId,
  senderName,
  selectedFile,
  setSelectedFile,
  isUploading,
}) => {
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setSelectedFile(file);
    } else {
      alert("Only .doc and .docx files are allowed!");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Modal
        title="Tải lên tệp"
        open={open}
        // confirmLoading={confirmLoading}
        onCancel={handleCancel}
        onClose={handleCancel}
        footer={() => (
          <>
            <Button type="link" onClick={() => setOpen(false)}>
              Đóng
            </Button>
            <Button type="primary" onClick={() => handler()}>
              Xác nhận
            </Button>
          </>
        )}
      >
        {isUploading && (
          <CustomRotateZLoader
            isLoading={isUploading}
            content={"Đang xử lý tài liệu ^-^"}
          />
        )}
        <div>
          <div className="notification-sender-name">{senderName}</div>
          <p>{message}</p>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{
                width: "200px",
                height: "80px",
                border: "2px dashed #ccc",
                borderRadius: "10px",
                margin: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {selectedFile ? (
                <p style={{ color: "#007bff" }}>{selectedFile.name}</p>
              ) : (
                <p style={{ color: "#aaa" }}>Drag and drop a file here</p>
              )}
            </div>

            <label
              htmlFor="file-upload"
              style={{
                marginTop: "20px",
                display: "inline-block",
                padding: "5px 8px",
                backgroundColor: "#007bff",
                color: "#fff",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Chọn tệp .docx/.doc
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".doc,.docx"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FileUploadDialog;
