import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { useEffect } from "react";
import "./addNewClass.css";
import ClassesApi from "../../api/ClassesApi";
import usePrivateRequest from "../../../hook/usePrivateRequest";
import useAuth from "../../../hook/useAuth";
import FeedBackFailed from "../feedbacks/failed/FeedBackFailed";
import FeedbackSuccess from "../feedbacks/success/FeedbackSuccess";

const AddNewClass = ({
  isAddClassModalVisible,
  setIsAddClassModalVisible,
  newClassAddedActivated,
}) => {
  const { auth } = useAuth();
  const [addClassContent, setAddClassContent] = React.useState({
    className: "",
    classGrade: 0,
    classStatus: "PRIVATE",
    classDesc: "",
  });

  const [fileClassAvt, setFileClassAvt] = React.useState(null);

  const [errors, setErrors] = React.useState({});
  const [isAddingClass, setIsAddingClass] = React.useState(false);
  const [addingClassStatusResponse, setAddingClassStatusResponse] =
    React.useState({
      status: null,
      message: "",
    });
  const handleChangeAddClassContent = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...addClassContent, [name]: value };
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    setAddClassContent(updatedFormData);
  };

  console.log(addClassContent);

  const classNameRef = React.useRef();
  const classGradeRef = React.useRef();
  const classStatusRef = React.useRef();
  const classDescRef = React.useRef();

  const validateForm = () => {
    const errors = {};
    if (addClassContent.className === "") {
      errors.className = "Tên lớp không được để trống";
      classNameRef.current.focus();
    }
    if (addClassContent.classGrade === 0) {
      errors.classGrade = "Khối không được để trống";
      classNameRef.current.focus();
    }
    if (
      addClassContent.classDesc !== null &&
      addClassContent.classDesc.length > 1000
    ) {
      errors.classDesc = "Mô tả quá dài";
      classNameRef.current.focus();
    }
    return errors;
  };

  const validateField = (name, value) => {
    switch (name) {
      case "className":
        return value === "" ? "Tên lớp không được để trống" : "";
      case "classGrade":
        return value <= 0 || value > 12 ? "Khối không hợp lệ" : "";
      case "classDesc":
        return value.length > 1000 ? "Mô tả vượt quá 1000 ký tự" : "";
      default:
        return "";
    }
  };
  const axiosPrivate = usePrivateRequest();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fileClassAvt === null) {
      alert("Vui lòng chọn ảnh đại diện cho lớp học");
      return;
    }

    setAddingClassStatusResponse({
      status: null,
      message: "",
    });
    console.log(addClassContent);
    const errors = validateForm();
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log(errors);
      return;
    }
    // Call API here
    setIsAddingClass(true);
    const AddClassDto = {
      classDto: {
        className: addClassContent.className,
        classGrade: addClassContent.classGrade,
        classStatus: addClassContent.classStatus,
        classDesc: addClassContent.classDesc,
        createdAt: new Date(),
      },
      teacherId: auth?.memberId,
    };
    console.log(AddClassDto);

    const formData = new FormData();
    formData.append(
      "createClassRequest",
      new Blob([JSON.stringify(AddClassDto)], { type: "application/json" })
    );
    formData.append("classAvatarFile", fileClassAvt);

    const res = await ClassesApi.addClass(axiosPrivate, formData);
    console.log(res);

    if (res.status === 201 || res.status === 200) {
      setIsAddingClass(false);
      setAddingClassStatusResponse({
        status: 200,
        message: "Success",
      });
      newClassAddedActivated(res.data);
    } else if (res.status >= 500) {
      setAddingClassStatusResponse({
        status: 500,
        message: "Failed",
      });
      setIsAddingClass(false);
    } else {
      setIsAddingClass(false);
      setAddingClassStatusResponse({
        status: 400,
        message: "Failed",
      });
    }

    // setAddClassContent({
    //   className: "",
    //   classGrade: 0,
    //   classStatus: true,
    //   classDesc: "",
    // });
    setIsAddingClass(false);
  };

  const onCloseAddClassModal = () => {
    setIsAddClassModalVisible(false);
    setIsAddingClass(false);
    setAddClassContent({
      className: "",
      classGrade: 0,
      classStatus: true,
      classDesc: "",
    });
    setAddingClassStatusResponse({
      status: null,
      message: "",
    });
  };

  console.log(addingClassStatusResponse);
  console.log(isAddingClass);

  return (
    <div
      className={`add-class-container ${
        isAddClassModalVisible ? "add-class-activated" : "add-class-deactivated"
      }`}
    >
      <div className="primary-title d-flex align-items-center justify-content-between">
        Tạo lớp mới
        <button
          className={`a-add-class-btn`}
          onClick={() => onCloseAddClassModal()}
        >
          {/* {isAddClassModalVisible ? <CloseOutlined /> : <PlusOutlined />} */}
          <CloseOutlined />
          {/* <span>{isAddClassModalVisible ? "Đóng" : "Tạo Lớp"}</span> */}
          <span>Đóng</span>
          {/* <span className="add-class-shortcut">
            {isAddClassModalVisible ? "X" : "N"}
          </span> */}
          <span className="add-class-shortcut">X</span>
        </button>
      </div>

      <div className="primary-line">
        <form
          onSubmit={handleSubmit}
          className="needs-validation mt-2"
          noValidate
        >
          <div className="add-class-form" style={{ position: "relative" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="class-name">
                Tên lớp
              </label>
              <input
                ref={classNameRef}
                type="text"
                id="class-name"
                name="className"
                className="form-control"
                required
                value={addClassContent.className}
                onChange={(e) => handleChangeAddClassContent(e)}
              />
              {
                <div
                  className={`invalid-feedback ${
                    errors.className && "d-block"
                  }`}
                >
                  {errors.className}
                </div>
              }
              <br />
              <label className="form-label" htmlFor="class-grade">
                Khối
              </label>
              <input
                ref={classGradeRef}
                type="number"
                id="class-grade"
                name="classGrade"
                className="form-control w-25"
                required
                value={addClassContent.classGrade}
                onChange={(e) => handleChangeAddClassContent(e)}
                min={1}
                max={12}
              />
              {
                <div
                  className={`invalid-feedback ${
                    errors.classGrade && "d-block"
                  }`}
                >
                  {errors.classGrade}
                </div>
              }
              <br />
              <label className="form-label" htmlFor="class-status">
                Trạng thái
              </label>
              <select
                ref={classStatusRef}
                name="classStatus"
                id="class-status"
                className="form-control w-25"
                value={addClassContent.classStatus || "PUBLIC"}
                onChange={(e) => handleChangeAddClassContent(e)}
              >
                <option value={"PUBLIC"}>Mở</option>
                <option value={"PRIVATE"}>Riêng tư</option>
              </select>

              <label htmlFor="class-avt" className="form-label mt-3">
                Ảnh đại diện
              </label>
              <input
                type="file"
                id="class-avt"
                name="classAvt"
                className="form-control"
                onChange={(e) => {
                  setFileClassAvt(e.target.files[0]);
                }}
                //only accept image file
                accept="image/*"
              />

              <br />
              <label className="form-label" htmlFor="class-desc">
                Mô tả
              </label>
              <textarea
                ref={classDescRef}
                name="classDesc"
                id="class-desc"
                className="form-control"
                value={addClassContent.classDesc}
                onChange={(e) => handleChangeAddClassContent(e)}
              ></textarea>
              {
                <div
                  className={`invalid-feedback ${
                    errors.classDesc && "d-block"
                  }`}
                >
                  {errors.classDesc}
                </div>
              }
            </div>
          </div>
          <button
            className={`a-add-class-btn w-100 mt-4 justify-content-center ${
              isAddingClass ? "disabled" : ""
            }`}
            style={{ height: "40px", fontSize: "16px" }}
            type="submit"
            // onClick={(e) => handleSubmit(e)}
            disabled={isAddingClass}
          >
            {isAddingClass ? (
              <span>
                <LoadingOutlined /> Đang tạo lớp
              </span>
            ) : (
              "Tạo mới"
            )}
          </button>
        </form>

        <div />
      </div>

      {/* <div
        className={`add-class-loading-container ${
          addingClassStatusResponse.status !== null
            ? "adding-class-stt-activated"
            : "adding-class-stt-deactivated"
        }`}
      >
        {addingClassStatusResponse.status !== null &&
          addingClassStatusResponse.status >= 400 && (
            <FeedBackFailed
              status={"error"}
              title={"Tạo lớp Thất bại"}
              subTitle={`Tạo lớp học [${addClassContent.className}] thất bại. Vui lòng thử lại sau.`}
              continueFunction={() =>
                setAddingClassStatusResponse({
                  status: null,
                  message: "",
                })
              }
              closeModal={onCloseAddClassModal}
            />
          )}
        {addingClassStatusResponse.status !== null &&
          addingClassStatusResponse.status === 200 && (
            <FeedbackSuccess
              status={"success"}
              title={"Tạo Lớp Thành Công"}
              subTitle={`Tạo thành công lớp học [${addClassContent.className}]. Vui vòng kiểm tra lại ở Trang chủ.`}
              closeModal={onCloseAddClassModal}
              continueFunction={() =>
                setAddingClassStatusResponse({
                  status: null,
                  message: "",
                })
              }
            />
          )}
      </div> */}
    </div>
  );
};

export default AddNewClass;
