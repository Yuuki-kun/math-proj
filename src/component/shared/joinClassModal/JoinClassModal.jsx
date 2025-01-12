import { AudioOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";
import { Modal, Space, Input } from "antd";
import React, { useState } from "react";
import "./joinClassModal.css";
import JoinClassItem from "./JoinClassItem";
import ClassesApi from "../../api/ClassesApi";

const { Search } = Input;

const JoinClassModal = ({
  axiosPrivate,
  studentId,
  userId,
  open,
  setOpen,
  setReloadClassList,
}) => {
  // const { Search } = Input;

  const [isSearching, setIsSearching] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [selectedId, setSelectedId] = useState(-1);
  const handleOk = () => {
    // setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const onSearch = async (value, _e) => {
    console.log(value);
    setIsSearching(true);

    const rs = await ClassesApi.findByName(axiosPrivate, value, studentId);

    setSearchResult(rs.data);
    setIsSearching(false);
  };

  const onJoinClassHandler = async (classData) => {
    console.log("Joining class", classData);
    if (!classData.id || !studentId || selectedId !== classData.id) return;
    const rs = await ClassesApi.joinClass(
      axiosPrivate,
      studentId,
      classData.id,
      userId
    );
    console.log(rs);
    if (rs.status === 200 || rs.status === 201) {
      if (classData.classStatus === "PRIVATE") {
        classData.enrollmentStatus = "WAITING";
      } else if (classData.classStatus === "PUBLIC") {
        classData.enrollmentStatus = "ENROLLED";
      } else {
      }
      setSearchResult(
        searchResult.map((item) =>
          item.id === classData.id ? classData : item
        )
      );
      setReloadClassList(true);
    }
    setSelectedId(-1);
  };

  return (
    <>
      <Modal
        title="Tham gia lớp học"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        centered
        closable
        closeIcon={<CloseOutlined style={{ color: "red" }} />}
        style={{
          maxWidth: "600px",
        }}
        // loading
      >
        <div>
          <Space direction="vertical" className="w-75">
            <Search
              placeholder="Tên lớp học"
              onSearch={onSearch}
              enterButton
              loading={isSearching}
              disabled={isSearching}
            />
          </Space>
        </div>
        {searchResult && (
          <>
            <div
              className="join-class-tool-tip mt-3"
              style={{ fontStyle: "italic", fontWeight: "500", color: "black" }}
            >
              <span className="d-block">
                Bấm chọn vào lớp mà bạn dự định tham gia
              </span>
            </div>
            <div className="join-class-list-container">
              {searchResult.map((data, index) => (
                <JoinClassItem
                  key={index}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  data={data}
                  onJoinClassHandler={onJoinClassHandler}
                />
              ))}
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default JoinClassModal;
