import React, { useState } from "react";
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
import useAuth from "../../hook/useAuth";
import { LoginService } from "../api/loginService";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
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
const Login = () => {
  const [responseErrors, setResponseError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...loginData, [name]: value };

    setLoginData(updatedFormData);
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setResponseError(null);
    try {
      const response = await LoginService(loginData);
      console.log(response);

      setAuth({
        email: response.email,
        roles: response.roles,
        accessToken: response.accessToken,
        userId: response.userId,
        memberId: response.memberId,
      });

      if (response.roles.includes("ADMIN") || response.roles.includes("USER")) {
        navigate("/home");
      } else {
        navigate("/login");
      }
    } catch (error) {
      if (error.status >= 400 && error.status <= 500) {
        setResponseError(error.response.data.details);
      }

      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="d-flex flex-column align-items-center auth-form-cont justify-content-between">
      <div style={{ width: "30%", marginBottom: "10px" }}>
        <img
          className="img-fluid"
          src="assets/images/Logo-test.png"
          alt="Logo"
        />
      </div>
      <div className="mt-2 text-danger fs-6 fw-bold text-center">
        <p>{responseErrors}</p>
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
        <Form.Item
          label="Email"
          // autoComplete="newpassword"
        >
          <Input
            name="email"
            value={loginData.email}
            onChange={handleChange}
            // autoComplete="username"
          />
        </Form.Item>

        <Form.Item label="Password">
          <Input.Password
            name="password"
            value={loginData.password}
            onChange={handleChange}
            // onBlur={handleBlur}
            // autoComplete="new-password"
          />
        </Form.Item>

        <Link
          style={{
            color: "blue",
            fontSize: "15px",
            textAlign: "left",
            width: "100%",
            display: "block",
            marginBottom: "10px",
            fontWeight: "450",
            fontStyle: "italic",
            textDecoration: "underline",
          }}
          to={"/authentication/register"}
        >
          Đăng ký
          <GoArrowUpRight />
        </Link>

        <Form.Item>
          <Button
            className="mt-4"
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

export default Login;
