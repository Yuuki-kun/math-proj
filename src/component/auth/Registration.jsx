import React, { useEffect, useState } from "react";
import { AccountTypeEnum, defaultAccountType } from "../../model/AccountType";
import { CheckCircleFilled, SmileOutlined } from "@ant-design/icons";
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Mentions,
  Select,
  TimePicker,
  TreeSelect,
} from "antd";
import "./auth.css";
import { RegistrationService } from "../api/registerService";
import useAuth from "../../hook/useAuth";
import { useNavigate } from "react-router-dom";
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};
const Registration = () => {
  const { setAuth } = useAuth();
  const [responseError, setResponseError] = useState(null);
  const [accountType, setAccountType] = useState(defaultAccountType);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    matchPassword: "",
    role: accountType,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    setFormData(updatedFormData);
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...validateField(name, value),
    }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    setErrors((prevErrors) => {
      return { ...prevErrors, ...validateField(name, value) };
    });
  };

  const validateField = (name, value) => {
    const newErrors = {};

    switch (name) {
      case "fullName":
        if (!value) {
          newErrors.fullName = "Full Name is required";
        } else if (value.length < 2) {
          newErrors.fullName = "Full Name must be at least 2 characters long";
        } else {
          newErrors.fullName = "";
        }
        break;

      case "email":
        if (!value) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Email is invalid";
        } else newErrors.email = "";
        break;
      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (value.length < 6) {
          newErrors.password = "Password must be at least 6 characters long";
        } else if (!/[A-Z]/.test(value)) {
          newErrors.password =
            "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(value)) {
          newErrors.password =
            "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(value)) {
          newErrors.password = "Password must contain at least one number";
        } else if (!/[!@#$%^&*]/.test(value)) {
          newErrors.password =
            "Password must contain at least one special character";
        } else newErrors.password = "";
        break;
      case "matchPassword":
        if (value !== formData.password) {
          newErrors.matchPassword = "Passwords do not match";
        } else if (value === formData.password && errors.password !== "") {
          newErrors.matchPassword = "Passwords above do not meet the criteria";
        } else newErrors.matchPassword = "";
        break;
      default:
        break;
    }
    return newErrors;
  };
  useEffect(() => {
    console.log("Errors:", errors);
  }, [errors]);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    // e.preventDefault();
    const finalErrors = {};

    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      const fieldErrors = validateField(key, value);
      if (fieldErrors[key]) {
        finalErrors[key] = fieldErrors[key];
      }
    });

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
    } else {
      console.log(formData);

      setIsSubmitting(true);
      // setTimeout(() => {
      //   setIsSubmitting(false);
      //   alert("Registration successful");
      // }, 2000);

      try {
        // console.log(process.env.REACT_APP_BE_API_URL);
        const user = {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: formData.role,
        };
        console.log(user);
        const registerResponse = await RegistrationService(user);

        setAuth({
          email: registerResponse.email,
          roles: registerResponse.roles,
          accessToken: registerResponse.accessToken,
          userId: registerResponse.userId,
          memberId: registerResponse.memberId,
        });

        setIsSubmitting(false);

        navigate("/home");

        console.log(registerResponse);
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
        if (error.status >= 400 && error.status <= 500) {
          setResponseError(error.response.data.details);
        }
      }
    }
  };

  return (
    <div className="d-flex flex-column align-items-center auth-form-cont">
      <div style={{ width: "30%", marginBottom: "10px" }}>
        <img
          className="img-fluid"
          src="assets/images/Logo-test.png"
          alt="Logo"
        />
      </div>
      <div
        className="mt-2 text-danger fs-6 fw-bold text-center"
        // style={{ maxWidth: "250px" }}
      >
        <p>{responseError}</p>
      </div>
      <Form
        {...formItemLayout}
        style={{
          minWidth: 200,
          maxWidth: "100%",
          width: 400,
        }}
        colon={false}
        labelAlign="left"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        size="large"
        onFinish={handleSubmit}
        disabled={isSubmitting}
      >
        {/* <Form.Item
          label="Full Name"
          validateStatus={
            errors.fullName && errors.fullName !== "" ? "error" : "success"
          }
          help={errors.fullName ? errors.fullName : ""}
          hasFeedback={errors.fullName || errors.fullName === ""}
        >
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            // id="error"
          />
        </Form.Item> */}
        <Form.Item
          name="fullName"
          label="Full Name"
          validateStatus={errors.fullName ? "error" : undefined}
          help={errors.fullName || " "} // Thay vì chuỗi rỗng, dùng khoảng trắng
        >
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          validateStatus={
            errors.email && errors.email !== "" ? "error" : "success"
          }
          help={errors.email ? errors.email : ""}
          // autoComplete="newpassword"
        >
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          validateStatus={
            errors.password && errors.password !== "" ? "error" : "success"
          }
          help={errors.password ? errors.password : ""}
        >
          <Input.Password
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          validateStatus={
            errors.matchPassword && errors.matchPassword !== ""
              ? "error"
              : "success"
          }
          help={errors.matchPassword ? errors.matchPassword : ""}
        >
          <Input.Password
            name="matchPassword"
            value={formData.matchPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item
          label="Account Type"
          style={{
            maxWidth: "100%",
            minWidth: "30%",
            width: "30%",
          }}
        >
          <Select
            defaultValue={accountType}
            style={{ width: "100%" }}
            onChange={(value) => {
              setAccountType(value);
              setFormData((prevData) => ({ ...prevData, role: value }));
            }}
            value={accountType}
          >
            {Object.values(AccountTypeEnum).map((account) => (
              <Select.Option key={account} value={account}>
                {account}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            iconPosition="end"
            style={{ width: "100%" }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Registration;
