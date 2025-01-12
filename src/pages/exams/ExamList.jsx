import React from "react";
import { IoNewspaperOutline } from "react-icons/io5";
import "./exam-list.css";

import { message, Space, Table, Tag } from "antd";
import { render } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { GiPapers } from "react-icons/gi";
import { FiEdit3 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { LiaRedoAltSolid } from "react-icons/lia";
import { FaEye } from "react-icons/fa";
import NotificationDialog from "../../component/shared/dialog/NotificationDialog";
import usePrivateRequest from "../../hook/usePrivateRequest";
import useAuth from "../../hook/useAuth";
import ExamApi from "../../component/api/ExamApi";

const ExamList = ({ examList, roles }) => {
  const columns = [
    {
      title: "Tên",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <div className="d-flex align-items-center" style={{ height: "30px" }}>
          {/* <span><IoNewspaperOutline size={18} /></span> */}
          <a
            style={{
              color: "#0d6efd",
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            {text}
          </a>
        </div>
      ),
    },

    {
      title: "Thời gian",
      dataIndex: "timeLimit",
      key: "timeLimit",
      render: (time) => (
        <span
          style={{
            fontWeight: 500,
            //color with similar with dark blue
            color: "#333",
          }}
        >
          {time ? `${time} phút` : "N/A"}
        </span>
      ),
    },
    {
      title: "Số lần thử lại",
      dataIndex: "retakeLimit",
      key: "retakeLimit",
      render: (retakeLimit) => (
        <span
          style={{
            fontWeight: 500,
            //color with similar with dark green
            color: "#333",
          }}
        >
          {retakeLimit ? retakeLimit : "0"}
        </span>
      ),
    },

    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate) => (
        <span
          style={{
            fontWeight: 500,
            //color with similar with light grey
            color: "#6c757d",
          }}
        >
          {startDate
            ? new Date(startDate).toLocaleString("en-US", { hourCycle: "h23" })
            : "N/A"}
        </span>
      ),
    },

    {
      title: "Hạn chót",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => (
        <span
          style={{
            fontWeight: 500,
            //color with similar with  dark red
            color: "rgb(200 68 81)",
          }}
        >
          {endDate
            ? new Date(endDate).toLocaleString("en-US", { hourCycle: "h23" })
            : "N/A"}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (longDate) => (
        <span>
          {longDate ? new Date(longDate).toLocaleDateString() : "N/A"}
        </span>
      ),
    },

    //   {
    //     title: "Tags",
    //     key: "tags",
    //     dataIndex: "tags",
    //     render: (_, { tags }) => (
    //       <>
    //         {tags.map((tag) => {
    //           let color = tag.length > 5 ? "geekblue" : "green";
    //           if (tag === "loser") {
    //             color = "volcano";
    //           }
    //           return (
    //             <Tag color={color} key={tag}>
    //               {tag.toUpperCase()}
    //             </Tag>
    //           );
    //         })}
    //       </>
    //     ),
    //   },
    {
      title: "",
      key: "action",
      render: () => (
        <Space size="middle">
          <a className="exam-view-action-icon edit-exam-icon">
            <FiEdit3 size={18} color="blue" />
          </a>
          <a className="exam-view-action-icon delete-exam-icon">
            <MdDeleteOutline size={18} color="red" />
          </a>
        </Space>
      ),
    },
  ];

  const columnsForUser = [
    {
      title: "Tên",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (text) => (
        <div className="d-flex align-items-center" style={{ height: "30px" }}>
          {/* <span><IoNewspaperOutline size={18} /></span> */}
          <a
            style={{
              color: "#0d6efd",
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            {text}
          </a>
        </div>
      ),
    },
    {
      title: "Lớp",
      dataIndex: "assignedClassName",
      key: "assignedClassName",
      render: (assignedClassName) => (
        <span
          style={{
            fontWeight: 525,
            //color with similar with dark blue
            color: "#333",
          }}
        >
          {assignedClassName ? assignedClassName : "N/A"}
        </span>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "timeLimit",
      key: "timeLimit",
      width: 100,
      render: (time) => (
        <span
          style={{
            fontWeight: 500,
            //color with similar with dark blue
            color: "#333",
          }}
        >
          {time ? `${time} phút` : "N/A"}
        </span>
      ),
    },
    {
      title: "Thử lại",
      dataIndex: "retakeLimit",
      key: "retakeLimit",
      width: 80,
      render: (retakeLimit) => (
        <span
          style={{
            fontWeight: 500,
            //color with similar with dark green
            color: "#333",
          }}
        >
          {retakeLimit ? retakeLimit : "0"}
        </span>
      ),
    },

    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate) => (
        <span
          style={{
            fontWeight: 500,
            //color with similar with light grey
            color: "#6c757d",
          }}
        >
          {startDate
            ? new Date(startDate).toLocaleString("en-US", { hourCycle: "h23" })
            : "N/A"}
        </span>
      ),
    },

    {
      title: "Hạn chót",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => (
        <span
          style={{
            fontWeight: 500,
            //color with similar with  dark red
            color: "rgb(200 68 81)",
          }}
        >
          {endDate
            ? new Date(endDate).toLocaleString("en-US", { hourCycle: "h23" })
            : "N/A"}
        </span>
      ),
    },

    //   {
    //     title: "Tags",
    //     key: "tags",
    //     dataIndex: "tags",
    //     render: (_, { tags }) => (
    //       <>
    //         {tags.map((tag) => {
    //           let color = tag.length > 5 ? "geekblue" : "green";
    //           if (tag === "loser") {
    //             color = "volcano";
    //           }
    //           return (
    //             <Tag color={color} key={tag}>
    //               {tag.toUpperCase()}
    //             </Tag>
    //           );
    //         })}
    //       </>
    //     ),
    //   },
    {
      title: "Điểm cao nhất",
      dataIndex: "highestScore",
      key: "highestScore",
      width: 130,
      sorter: (a, b) => a - b,
      render: (highestScore) => (
        <span
          style={{
            fontWeight: 500,
            //color with similar with dark green
            color: "#333",
          }}
        >
          {highestScore ? highestScore : "0"}
        </span>
      ),
    },
    {
      title: "",
      key: "user-action",
      render: () => (
        <Space size="middle">
          <a className="exam-view-action-icon edit-exam-icon">
            <LiaRedoAltSolid size={18} color="green" />
          </a>
          <a className="exam-view-action-icon delete-exam-icon">
            <FaEye size={18} color="blue" />
          </a>
        </Space>
      ),
    },
  ];

  const [dialogStatus, setDialogStatus] = React.useState({
    type: "CONFIRM_BEFORE_ACTION",
    message: "",
  });

  const navigate = useNavigate();

  const [openConfirmStartExamDialog, setOpenConfirmStartExamDialog] =
    React.useState(false);

  const [selectedRow, setSelectedRow] = React.useState(null);

  const axiosPrivate = usePrivateRequest();
  const { auth } = useAuth();

  const onClickRow = (record, rowIndex) => {
    console.log(record, rowIndex);
    if (roles?.some((r) => r === "ADMIN")) {
      navigate(`/exams/info?id=${record.id}`);
    } else if (roles?.some((r) => r === "USER")) {
      // navigate(`/exams/user/info?id=${record.id}`);
      setSelectedRow(record);
      setOpenConfirmStartExamDialog(true);
      setDialogStatus({
        type: "CONFIRM_BEFORE_ACTION",
        message: `Thời gian làm bài: ${record.timeLimit} phút. Bắt đầu thi?`,
      });
    }
  };

  const startExamAttemptApi = async () => {
    console.log(selectedRow?.id);

    try {
      const rs = await ExamApi.startExamAttemptApi(
        axiosPrivate,
        auth?.memberId,
        selectedRow?.id
      );

      console.log(rs);

      return rs.data;
    } catch (error) {
      console.log(error);
      setOpenConfirmStartExamDialog(true);

      setDialogStatus({
        type: "INFORMATION",
        message: `Không thể bắt đầu thi. Lỗi: ${error?.response?.data}`,
      });

      return null;
    }
  };

  const handleStartExam = async () => {
    console.log("Start exam");
    setOpenConfirmStartExamDialog(false);

    const attemptId = await startExamAttemptApi();

    if (attemptId > 0) {
      navigate(`/exams/practice/${selectedRow?.id}?attempt=${attemptId}`);
    }
  };

  return (
    <div className="exam-list-container">
      <NotificationDialog
        open={openConfirmStartExamDialog}
        setOpen={setOpenConfirmStartExamDialog}
        message={dialogStatus.message}
        type={dialogStatus.type}
        handleAccept={handleStartExam}
      />
      <div className="d-flex align-items-center mb-4">
        <span>
          <GiPapers size={20} color="blue" />
        </span>
        <h6
          style={{
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 0,
          }}
        >
          Tất cả đề kiểm tra
        </h6>
      </div>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              onClickRow(record, rowIndex);
            }, // click row
          };
        }}
        columns={roles?.some((r) => r === "ADMIN") ? columns : columnsForUser}
        dataSource={examList}
        pagination={{
          total: examList.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tất cả ${total} đề thi`,
          pageSizeOptions: ["5", "10", "20", "30"],
          pageSize: 5,
        }}
        scroll={{ x: 100 }}
        sticky={{
          offsetHeader: 0,
        }}
      />
    </div>
  );
};

export default ExamList;
