import {
  LockOutlined,
  LockTwoTone,
  UnlockOutlined,
  UnlockTwoTone,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";
import "./joinClassItem.css";
import { Tag } from "antd";
const JoinClassItem = ({
  data,
  selectedId,
  setSelectedId,
  onJoinClassHandler,
}) => {
  return (
    <div
      className={`join-class-item ${
        data?.enrollmentStatus !== null ? "cant-active" : ""
      }`}
      onClick={() => setSelectedId(data.id)}
    >
      <span className="join-rs-class-name">
        <span className="me-2">
          {data.classStatus === "PUBLIC" && (
            <UnlockOutlined
              style={{
                color: "green",
              }}
            />
          )}
          {data.classStatus === "PRIVATE" && (
            <LockOutlined
              style={{
                color: "red",
              }}
            />
          )}
          {data.classStatus === "CLOSED" && <p>CLOSE</p>}
        </span>
        <span style={{ marginRight: "10px" }}>{data.className}</span>

        {data?.enrollmentStatus === "WAITING" && (
          <Tag style={{ display: "inline-block" }} color="red">
            Đang chờ duyệt
          </Tag>
        )}

        {data?.enrollmentStatus === "ENROLLED" && (
          <Tag style={{ display: "inline-block" }} color="red">
            Đã tham gia
          </Tag>
        )}
      </span>
      <div className="join-rs-class-short-info">
        <div className="">
          <UserOutlined /> <span>22</span>
        </div>
        <span className="join-rs-class-teacher">{data.teacher}</span>
        {selectedId === data.id && data.enrollmentStatus === null && (
          <button
            className="join-class-btn"
            onClick={() => onJoinClassHandler(data)}
            style={{
              backgroundColor:
                data.classStatus !== "PUBLIC" ? "#d38282" : "null",
            }}
          >
            <span>
              {data.classStatus === "PUBLIC" && "Tham gia"}
              {data.classStatus === "PRIVATE" && "Ghi danh"}
              {data.classStatus === "CLOSED" && "Đã đóng"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default JoinClassItem;
