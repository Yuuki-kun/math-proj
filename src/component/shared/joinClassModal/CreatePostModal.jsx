import { CloseOutlined } from "@ant-design/icons";
import { Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import "./create-post.css";
import ClassPostApi from "../../api/ClassPostApi";
import useAuth from "../../../hook/useAuth";
const CreatePostModal = ({
  axiosPrivate,
  open,
  setOpen,
  classId = -1,
  setLoading,
}) => {
  const [files, setFiles] = React.useState([]);
  console.log(files);

  const [createPostData, setCreatePostData] = React.useState({
    title: "",
    content: "",
    authorUserId: -1,
    parentClassId: -1,
  });

  const onChange = (e) => {
    setCreatePostData({ ...createPostData, [e.target.name]: e.target.value });
  };

  const onCancel = () => {
    setFiles([]);
    setCreatePostData({
      title: "",
      content: "",
      authorUserId: -1,
      parentClassId: -1,
    });
    setOpen(false);
  };

  const { auth } = useAuth();

  const handleOk = async () => {
    setLoading(true);

    const formData = new FormData();

    const createPostDto = {
      title: createPostData.title,
      content: createPostData.content,
      authorUserId: auth?.userId,
      parentClassId: classId,
    };

    formData.append(
      "createPostDto",
      new Blob([JSON.stringify(createPostDto)], { type: "application/json" })
    );

    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const rs = await ClassPostApi.createPost(axiosPrivate, formData);
      console.log(rs);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm bài viết"
      open={open}
      onOk={handleOk}
      //   confirmLoading={confirmLoading}
      onCancel={onCancel}
      centered
      closable={onCancel}
      closeIcon={<CloseOutlined style={{ color: "red" }} />}
      style={{
        maxWidth: "800px",
      }}
    >
      <Input
        allowClear
        name="title"
        placeholder="Tiêu đề"
        onChange={(e) => onChange(e)}
        maxLength={1000}
        value={createPostData?.title}
        style={{
          marginBottom: "15px",
        }}
      />
      <TextArea
        name="content"
        placeholder="Nội dung"
        allowClear
        onChange={(e) => onChange(e)}
        value={createPostData?.content}
      />
      {/* attached files */}
      <div class="upload-container">
        <b>Chọn tệp để tải lên</b>
        <input
          type="file"
          id="fileInput"
          multiple
          accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
          onChange={(e) => setFiles(e.target.files)}
        />
        <label for="fileInput">Chọn tệp</label>
        <ul class="file-list" id="fileList">
          {files.length > 0 &&
            [...files].map((file, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{file.name}</span>
                {/* round */}
                <span> {Number(file.size / 1024).toFixed(2)} KB</span>
              </li>
            ))}
        </ul>
      </div>
    </Modal>
  );
};

export default CreatePostModal;
