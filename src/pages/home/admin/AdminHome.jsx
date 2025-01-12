import React, { useEffect } from "react";
import "./adminHome.css";
import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Empty } from "antd";
import AddNewClass from "../../../component/shared/addClass/AddNewClass";
import ClassCardComponent from "../../../component/shared/cards/ClassCardComponent";
import ClassesApi from "../../../component/api/ClassesApi";
import ClassesSkeletonLoading from "../../../component/shared/loading/ClassesSkeletonLoading";
import CustomRotateZLoader from "../../../component/shared/loading/CustomRotateZLoader";
import ActionResultNotification from "../../../component/shared/notifications/ActionResultNotification";
import usePrivateRequest from "../../../hook/usePrivateRequest";
import useAuth from "../../../hook/useAuth";
const AdminHome = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  const [isAddClassModalVisible, setIsAddClassModalVisible] =
    React.useState(false);

  const [classData, setClassData] = React.useState(null);

  const [paging, setPaging] = React.useState({
    currentPage: 0,
    maxPage: 0,
    size: 21,
    totalElements: 0,
  });

  //get classes
  const axiosPrivate = usePrivateRequest();
  const { auth } = useAuth();

  const getClasses = async () => {
    setIsLoading(true);
    try {
      const response = await ClassesApi.getClasses(
        axiosPrivate,
        auth?.memberId,
        {
          page: 0,
          size: 21,
        }
      );
      console.log(response);
      setClassData(
        Array.isArray(response.data.content) ? response.data.content : []
      );
      setPaging({
        ...paging,
        currentPage: response.data.pageable.pageNumber,
        maxPage: response.data.totalPages,
        totalElements: response.data.totalElements,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getClasses = async () => {
      setIsLoading(true);
      try {
        const response = await ClassesApi.getClasses(
          axiosPrivate,
          auth?.memberId,
          {
            page: 0,
            size: 21,
          }
        );
        console.log(response);
        setClassData(
          Array.isArray(response.data.content) ? response.data.content : []
        );
        setPaging({
          ...paging,
          currentPage: response.data.pageable.pageNumber,
          maxPage: response.data.totalPages,
          totalElements: response.data.totalElements,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    getClasses();
  }, []);

  const newClassAddedActivated = (newClassData) => {
    setIsNewClassAdded(true);
    setClassData([...classData, newClassData]);

    setTimeout(() => {
      setIsNewClassAdded(false);
    }, 1500);
  };

  const [isNewClassAdded, setIsNewClassAdded] = React.useState(false);
  console.log(classData);

  return (
    <div className="home-container">
      <ActionResultNotification
        isActivated={isNewClassAdded}
        type={"success"}
        message={"New class has been added"}
      />
      <AddNewClass
        isAddClassModalVisible={isAddClassModalVisible}
        setIsAddClassModalVisible={setIsAddClassModalVisible}
        newClassAddedActivated={newClassAddedActivated}
      />
      <div className="home-head card-fade-in">
        <h1 className="primary-title">Tất cả lớp học </h1>

        <button
          className={`a-add-class-btn`}
          onClick={() => setIsAddClassModalVisible(!isAddClassModalVisible)}
        >
          {<PlusOutlined />}
          <span>{"Tạo Lớp"}</span>
          <span className="add-class-shortcut">{"N"}</span>
        </button>
      </div>
      <div className="home-content">
        {isLoading && (
          <CustomRotateZLoader content={"Đang tải thông tin lớp học"} />
        )}

        {isLoading && <ClassesSkeletonLoading />}

        {classData && classData.length === 0 && !isLoading ? (
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

export default AdminHome;
