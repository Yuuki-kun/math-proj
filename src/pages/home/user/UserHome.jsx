import React, { useEffect, useState } from "react";
import "./userhome.css";
import ClassCardComponent from "../../../component/shared/cards/ClassCardComponent";
import { PlusOutlined } from "@ant-design/icons";
import JoinClassModal from "../../../component/shared/joinClassModal/JoinClassModal";
import ClassesApi from "../../../component/api/ClassesApi";

import useAuth from "../../../hook/useAuth";
import usePrivateRequest from "../../../hook/usePrivateRequest";
import CustomRotateZLoader from "../../../component/shared/loading/CustomRotateZLoader";
import ClassesSkeletonLoading from "../../../component/shared/loading/ClassesSkeletonLoading";
import { Empty } from "antd";
const UserHome = () => {
  const [isLoadingJoinedClasses, setIsLoadingJoinedClasses] = useState(false);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const joinClassHandler = () => {
    console.log("Join class");
  };

  const [reloadClassList, setReloadClassList] = useState(true);

  const [classData, setClassData] = useState(null);

  const { auth } = useAuth();
  const axiosPrivate = usePrivateRequest();
  useEffect(() => {
    // fetch joined classes
    const fetchJoinedClasses = async () => {
      setIsLoadingJoinedClasses(true);
      console.log("fetching joined classes");

      try {
        const res = await ClassesApi.getJoinedClasses(
          axiosPrivate,
          auth?.memberId,
          0,
          10
        );

        setClassData(res.data.content);
        setIsLoadingJoinedClasses(false);
      } catch (err) {
        console.log(err);
        setIsLoadingJoinedClasses(false);
      }
    };
    if (reloadClassList) {
      fetchJoinedClasses();
      setReloadClassList(false);
    }
  }, [reloadClassList]);

  return (
    <div className="home-container">
      <JoinClassModal
        open={open}
        setOpen={setOpen}
        axiosPrivate={axiosPrivate}
        studentId={auth?.memberId}
        userId={auth?.userId}
        setReloadClassList={setReloadClassList}
      />

      <div className="home-head card-fade-in">
        <h1 className="primary-title">Tất cả lớp học</h1>
        <button className={`a-add-class-btn`} onClick={() => setOpen(true)}>
          {<PlusOutlined />}
          <span>{"Vào Lớp"}</span>
          <span className="add-class-shortcut">{"N"}</span>
        </button>
      </div>
      <div className="home-content">
        {isLoadingJoinedClasses && (
          <CustomRotateZLoader content={"Đang tải thông tin lớp học"} />
        )}
        {isLoadingJoinedClasses && <ClassesSkeletonLoading />}

        {classData && classData.length === 0 && !isLoadingJoinedClasses ? (
          <div className="a-no-class">
            <Empty />
          </div>
        ) : (
          <div className="classes-container">
            {classData &&
              classData.map((data) => (
                <ClassCardComponent
                  data={data}
                  key={data.id}
                  // className={isFirstLoad ? "card-enter" : ""}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHome;
