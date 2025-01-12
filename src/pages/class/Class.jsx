import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./classPage.css";
import ClassApi from "../../component/api/ClassesApi";
import ClassPostApi from "../../component/api/ClassPostApi";

import usePrivateRequest from "../../hook/usePrivateRequest";
import { BsDot } from "react-icons/bs";
import { MdPublic } from "react-icons/md";
import { GoEyeClosed } from "react-icons/go";
import CustomRotateZLoader from "../../component/shared/loading/CustomRotateZLoader";
import { LoadingOutlined } from "@ant-design/icons";
import { IoCreateOutline } from "react-icons/io5";
import CreatePostModal from "../../component/shared/joinClassModal/CreatePostModal";
import {
  FaCommentAlt,
  FaFileDownload,
  FaRegCommentAlt,
  FaUser,
} from "react-icons/fa";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
const Class = () => {
  const { id } = useParams();
  const [classData, setClassData] = React.useState(null);
  const [totalStudent, setTotalStudent] = React.useState(0);

  const [selectedMenu, setSelectedMenu] = React.useState(0);

  const [classPosts, setClassPosts] = React.useState([]);

  const [openCreatePostModal, setOpenCreatePostModal] = React.useState(false);

  const [isFetchingClassData, setIsFetchingClassData] = React.useState(false);
  const [isFetchingTotalStudent, setIsFetchingTotalStudent] =
    React.useState(false);
  const [isFetchingClassFeature, setIsFetchingClassFeature] =
    React.useState(false);

  const [isAllPageLoading, setIsAllPageLoading] = React.useState(false);

  const [classPostPagination, setClassPostPagination] = React.useState({
    page: 0,
    size: 2,
  });

  const axiosPrivate = usePrivateRequest();

  const selectedMenuHandler = (index) => {
    setSelectedMenu(index);
  };

  const addPost = () => {
    setOpenCreatePostModal(true);
  };

  useEffect(() => {
    const fetchClassById = async () => {
      setIsFetchingClassData(true);
      try {
        const rs = await ClassApi.findById(axiosPrivate, id);
        setClassData(rs?.data);
        setIsFetchingClassData(false);
      } catch (err) {
        setIsFetchingClassData(false);

        console.log(err);
      }
    };

    const callCulateTotalStudent = async () => {
      setIsFetchingTotalStudent(true);
      try {
        const rs = await ClassApi.calculateTotalStudent(
          axiosPrivate,
          id,
          classPostPagination
        );
        setTotalStudent(rs?.data);
        setIsFetchingTotalStudent(false);
      } catch (err) {
        setIsFetchingTotalStudent(false);

        console.log(err);
      }
    };

    const fetchClassPosts = async () => {
      setIsFetchingClassFeature(true);
      try {
        const rs = await ClassPostApi.getPosts(
          axiosPrivate,
          id,
          classPostPagination
        );
        setClassPosts(rs?.data);
        setIsFetchingClassFeature(false);
      } catch (err) {
        setIsFetchingClassFeature(false);
        console.log(err);
      }
    };

    fetchClassById();
    callCulateTotalStudent();
    fetchClassPosts();
  }, [id]);

  console.log(classData);

  return (
    <div className="class-page-container">
      {isAllPageLoading && (
        <CustomRotateZLoader
          isLoading={isAllPageLoading}
          content={"Đang tải ..."}
        />
      )}
      <CreatePostModal
        open={openCreatePostModal}
        setOpen={setOpenCreatePostModal}
        classId={id}
        axiosPrivate={axiosPrivate}
        setLoading={setIsAllPageLoading}
      />
      <div className="class-info-section">
        {isFetchingClassData ? (
          <div>
            <LoadingOutlined
              style={{ fontSize: 24 }}
              spin={isFetchingClassData}
            />
            <span className="ms-2">Đang tải thông tin lớp học ...</span>
          </div>
        ) : (
          <div className="class-info">
            <div className="class-avt">
              <img src={classData?.imageUrl} alt="" className="img-fluid" />
            </div>
            <div
              style={{
                marginLeft: "24px",
              }}
            >
              <div className="class-name">{classData?.className}</div>
              <div className="class-total-students">
                {classData?.classStatus === "PUBLIC" && (
                  <span>
                    <MdPublic />
                    Lớp công khai
                  </span>
                )}
                {classData?.classStatus === "PRIVATE" && (
                  <span>
                    <GoEyeClosed />
                    Lớp riêng tư
                  </span>
                )}
                <span
                  style={{
                    color: "#7c7c7c",
                    fontWeight: "500",
                  }}
                >
                  <BsDot />
                  {isFetchingTotalStudent ? (
                    <LoadingOutlined spin={isFetchingTotalStudent} />
                  ) : (
                    <span>{totalStudent} học sinh</span>
                  )}
                </span>
              </div>
            </div>
            <div
              style={{
                marginLeft: "auto",
              }}
              className="class-teacher"
            >
              <div>Giáo viên: {classData?.teacherName}</div>
              <div className="d-flex align-items-center mt-2">
                <button
                  onClick={() => addPost()}
                  className="d-flex align-items-center a-add-class-btn"
                  style={{
                    fontSize: "16px",
                  }}
                >
                  <IoCreateOutline size={22} />
                  Đăng bài
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="class-menus">
        <button
          className={`class-menu-item ${selectedMenu === 0 ? "active" : ""}`}
          onClick={() => selectedMenuHandler(0)}
        >
          Bảng tin
        </button>
        <button
          className={`class-menu-item ${selectedMenu === 1 ? "active" : ""}`}
          onClick={() => selectedMenuHandler(1)}
        >
          Thảo luận
        </button>
        <button
          className={`class-menu-item ${selectedMenu === 2 ? "active" : ""}`}
          onClick={() => selectedMenuHandler(2)}
        >
          Bài tập
        </button>
        <button
          className={`class-menu-item ${selectedMenu === 3 ? "active" : ""}`}
          onClick={() => selectedMenuHandler(3)}
        >
          Mọi người
        </button>
      </div>

      <div
        className="class-posts-section"
        style={{
          position: "relative",
          minHeight: "200px",
        }}
      >
        {isFetchingClassFeature ? (
          <>
            {/* <LoadingOutlined
              style={{
                fontSize: 26,
              }}
            />
            <div>Đang tải ...</div> */}
            <CustomRotateZLoader
              isLoading={isFetchingClassFeature}
              content={"Đang tải ..."}
            />
          </>
        ) : (
          <div className="class-posts-section">
            {classPosts.map((post) => (
              <div key={post.id} className="class-post-item">
                <div className="class-post-item-user">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                      backgroundColor: "#f1f1f1",
                    }}
                  >
                    {post?.authorProfileImageUrl ? (
                      <img src="" alt="user-avt" />
                    ) : (
                      <FaUser size={25} />
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "450",
                        color: "#333",
                      }}
                    >
                      {post?.authorName}
                    </span>
                    <span
                      style={{
                        color: "#7c7c7c",
                        fontSize: "14px",
                      }}
                    >
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="class-post-item-header">
                  <div className="class-post-item-title">{post.title}</div>
                </div>
                <div className="class-post-item-content">{post.content}</div>
                <div className="class-post-item-files">
                  {post?.imageUrls?.map((fileUrl, index) => {
                    // Hàm kiểm tra xem URL có phải là hình ảnh không
                    const isImage = (url) => {
                      const imageExtensions = [
                        "jpg",
                        "jpeg",
                        "png",
                        "gif",
                        "bmp",
                        "webp",
                      ];
                      const ext = url.split(".").pop().toLowerCase();
                      return imageExtensions.includes(ext);
                    };

                    return (
                      <div key={index} className="class-post-item-file">
                        {isImage(fileUrl) ? (
                          // Nếu là ảnh, hiển thị thẻ <img>
                          <div className="class-post-file-img-container">
                            <img
                              src={fileUrl}
                              alt={`File Preview ${index + 1}`}
                              className="class-post-file-img"
                            />
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                textDecoration: "none",
                                color: "blue",
                                textDecoration: "underline",
                              }}
                            >
                              {" "}
                              Hình ảnh đính kèm
                            </a>
                          </div>
                        ) : (
                          // Nếu không phải ảnh, hiển thị text "Tệp đính kèm"
                          <div className="class-post-file-img-container">
                            <FaFileDownload />
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                textDecoration: "none",
                                color: "blue",
                                textDecoration: "underline",
                              }}
                            >
                              File đính kèm
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div>
                  <button>
                    <AiOutlineLike />
                  </button>
                  <button>
                    <AiOutlineDislike />
                  </button>
                  <button>
                    <FaRegCommentAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Class;
