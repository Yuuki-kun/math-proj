import React, { useEffect } from "react";
import "./header.style.css";
import usePrivateRequest from "../../hook/usePrivateRequest";
import {
  BellTwoTone,
  CheckCircleFilled,
  CloseOutlined,
  MenuOutlined,
  PlusCircleTwoTone,
  SearchOutlined,
} from "@ant-design/icons";
import CustomSearchComponent from "../../component/shared/search/CustomSearchComponent";
import useAuth from "../../hook/useAuth";
import NotificationApi from "../../component/api/NotificationApi";
import { useLocation } from "react-router-dom";
import NotificationDialog from "../../component/shared/dialog/NotificationDialog";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { use } from "react";
import ActionResultNotification from "../../component/shared/notifications/ActionResultNotification";
import { message } from "antd";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { ApiUrl } from "../../config/apiUrl";
const Header = ({ isSidebarOpen, setSidebarOpen }) => {
  const { auth } = useAuth();

  const [openNotification, setOpenNotification] = React.useState(false);

  const [isNotificationActivated, setIsNotificationActivated] =
    React.useState(false);

  const [isUserAvatarActivated, setIsUserAvatarActivated] =
    React.useState(false);

  const [notifications, setNotifications] = React.useState([]);
  const [numberOfUnreadNotifications, setNumberOfUnreadNotifications] =
    React.useState(0);

  const [selectedNotification, setSelectedNotification] = React.useState(null);

  const [isNewNotificationReceived, setIsNewNotificationReceived] =
    React.useState(false);

  const [notificationMessage, setNotificationMessage] = React.useState("");
  const [isHandlingNotification, setIsHandlingNotification] =
    React.useState(false);

  const axiosPrivate = usePrivateRequest();
  const location = useLocation();
  const fetchNotifications = async () => {
    console.log("fetching notifications");

    try {
      const res = await NotificationApi.getNotifications(
        axiosPrivate,
        auth?.userId,
        0,
        10
      );

      setNotifications(res.data);
    } catch (err) {
      console.error("err load not=" + err);
    }
  };
  useEffect(() => {
    console.log(location.pathname);

    console.log(location.pathname === "/home");

    if (location.pathname === "/home") fetchNotifications();
  }, [location.pathname]);
  console.log(location);

  console.log(notifications);

  const handleNotificationClick = async (id) => {
    console.log("click notification", id);
    const selectedNotification = notifications.find(
      (notification) => notification.id === id
    );
    if (!selectedNotification) return;

    console.log(selectedNotification);

    setOpenNotification(true);
    setSelectedNotification(selectedNotification);
    if (!selectedNotification.read) {
      //call api to update notification status

      setNumberOfUnreadNotifications((prev) => prev - 1);
      try {
        const rs = await NotificationApi.updateNotificationStatus(
          axiosPrivate,
          selectedNotification.id
        );

        if (rs.status === 200) {
          console.log("update notification status successfully");
          selectedNotification.read = true;
          if (selectedNotification.notificationType === "INFORMATION") {
            selectedNotification.processed = true;
          }
        } else {
          console.log("update notification status failed");
        }
      } catch (err) {
        console.log(err);
      }
    }

    //call api to update notification status
  };

  const notificationHandler = (notificationId) => {
    if (selectedNotification.notificationType === "CONFIRM_JOIN_CLASS") {
      return handleAcceptJoinClass(notificationId);
    } else if (selectedNotification.notificationType === "INFORMATION") {
      return () => {};
    }
  };

  const handleAcceptJoinClass = async (notificationId) => {
    if (!notificationId || notificationId !== selectedNotification.id) return;
    console.log("accept join class", notificationId);

    //call api to handle notification
    setIsHandlingNotification(true);
    const rs = await NotificationApi.handleNotification(
      axiosPrivate,
      notificationId
    );

    console.log(rs);

    if (rs.status === 200 && rs.data > 0) {
      setIsHandlingNotification(false);
      setNotifications((prevNotifications) => {
        const index = prevNotifications.findIndex(
          (notification) => notification.id === notificationId
        );
        if (index === -1) return prevNotifications; // Nếu không tìm thấy thì không làm gì
        const updatedNotification = {
          ...prevNotifications[index],
          processed: true,
        };
        return [
          ...prevNotifications.slice(0, index),
          updatedNotification,
          ...prevNotifications.slice(index + 1),
        ];
      });

      return true;
    } else {
      setIsHandlingNotification(false);
      return false;
    }
  };

  //socket for notification
  let stompClient;
  useEffect(() => {
    const startSocket = () => {
      let ws = new SockJS("https://mathmotbe.onrender.com/mathmot-ap/ws");
      stompClient = Stomp.over(ws);
      //with bearer token
      stompClient.connect(
        { Authorization: `Bearer ${auth.accessToken}` },
        () => {
          console.log("connecting to socket");

          stompClient.subscribe(
            `/user/${auth.userId}/notifications`,
            (message) => {
              //we have a binary body
              console.log("message", message);
              //convert
              const binaryBody = message._binaryBody;
              const textData = new TextDecoder("utf-8").decode(binaryBody);
              const jsonData = JSON.parse(textData);
              console.log("json data", jsonData);
              //add new notification to the top of the list
              setIsNewNotificationReceived(true);
              setNotificationMessage(jsonData.message);
              setNotifications((prevNotifications) => [
                jsonData,
                ...prevNotifications,
              ]);

              setTimeout(() => {
                setIsNewNotificationReceived(false);
              }, 2000);
            }
          );
        }
      );
    };
    try {
      startSocket();
    } catch (err) {
      console.log(err);
    }

    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("disconnecting socket");
        });
      }
    };
  }, [auth]);

  useEffect(() => {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.read
    );
    setNumberOfUnreadNotifications(unreadNotifications.length);
  }, [notifications]);

  return (
    <header>
      <NotificationDialog
        open={openNotification}
        setOpen={setOpenNotification}
        message={selectedNotification?.message}
        senderName={selectedNotification?.senderName}
        handleAccept={notificationHandler}
        selectedNotificationId={selectedNotification?.id}
        isHandling={isHandlingNotification}
        type={selectedNotification?.notificationType}
        processed={selectedNotification?.processed}
      />
      <ActionResultNotification
        isActivated={isNewNotificationReceived}
        type={"new-notification"}
        message={notificationMessage}
      />
      <div className="header-container">
        <div className="menubar-container">
          <button
            className={`menubar-button ${isSidebarOpen ? "open" : ""}`}
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <span className="menubar-icon">
              {isSidebarOpen ? (
                <>
                  <CloseOutlined
                    style={{ fontSize: "20px", color: "#5f6368" }}
                  />
                </>
              ) : (
                <>
                  <MenuOutlined
                    style={{ fontSize: "20px", color: "#5f6368" }}
                  />
                </>
              )}
            </span>
          </button>
          <div className="app-logo">
            <img
              className="img-fluid"
              src="assets/images/Logo-test.png"
              alt="Logo"
            />
          </div>
        </div>
        <div className="user-area-container">
          <div className="head-plus-icon head-icon">
            <PlusCircleTwoTone style={{ fontSize: "24px" }} />
          </div>
          <CustomSearchComponent />
          <div
            className={`head-notification-icon head-icon ${
              isNotificationActivated ? "activated" : ""
            }`}
          >
            <button
              style={{
                width: "inherit",
                height: "inherit",
                border: "none",
                borderRadius: "inherit",
                backgroundColor: "transparent",
              }}
            >
              <BellTwoTone
                className={`${
                  !isNotificationActivated && numberOfUnreadNotifications > 0
                    ? "bell-ring"
                    : ""
                }`}
                onClick={() =>
                  setIsNotificationActivated(!isNotificationActivated)
                }
              />
            </button>
            {notifications &&
              notifications.length > 0 &&
              numberOfUnreadNotifications > 0 && (
                <div className="notification-number continue-fade-in">
                  {numberOfUnreadNotifications}
                </div>
              )}
            <div
              className={`notification-content-container ${
                isNotificationActivated ? "activated" : "deactivated"
              } `}
            >
              <div
                style={{
                  textAlign: "center",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
              >
                <p
                  className="mb-0"
                  style={{ fontWeight: "500", fontSize: "16px" }}
                >
                  Thông báo
                </p>
                <p
                  className="mb-0"
                  style={{
                    fontWeight: "400",
                    fontSize: "14px",
                    fontStyle: "italic",
                  }}
                >
                  (Bấm để xem thông báo)
                </p>
              </div>
              <div
                className="primary-line"
                style={{
                  backgroundColor: "lightgray",
                  height: "1px",
                }}
              ></div>
              {notifications.length > 0 &&
                notifications.map((notification) => (
                  <div
                    className="notification-item"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    {!notification?.read ? (
                      <div
                        className="notification-status"
                        style={{
                          backgroundColor: notification.read
                            ? "transparent"
                            : "red",
                        }}
                      ></div>
                    ) : (
                      <div>
                        {notification?.processed ? (
                          <IoMdCheckmarkCircleOutline
                            color="green"
                            size={"15px"}
                          />
                        ) : (
                          <MdOutlineRadioButtonUnchecked
                            color="red"
                            size={"15px"}
                          />
                        )}
                      </div>
                    )}

                    <div className="notification-content">
                      <div className="sender-notification-img-container">
                        <img
                          src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                          alt=""
                          className="sender-notification-img"
                        />
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <span
                          style={{
                            fontWeight: "430",
                            color: "#000",
                            fontSize: "14px",
                          }}
                        >
                          {notification.senderName}
                        </span>
                        <span className="text-clamp-3">
                          {notification.message}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="head-user-info">
            <div className="user-name d-flex align-items-center">
              <span>Tống Công Minh</span>
              <span className="ms-1 text-primary card-fade-in">
                {auth?.roles?.includes("ADMIN") ? "(Teacher)" : "(Student)"}
              </span>
            </div>

            <button
              className={`user-avatar ${
                isUserAvatarActivated ? "activated" : ""
              }`}
              onClick={() => setIsUserAvatarActivated(!isUserAvatarActivated)}
            >
              <img
                className="img-fluid"
                src="assets/images/Logo-test.png"
                alt="Avatar"
              />
            </button>

            <div
              className={`user-menu-container ${
                isUserAvatarActivated ? "activated" : "deactivated"
              }`}
            >
              <div>
                <div className="user-menu-item">Profile</div>
                <div className="user-menu-item">Settings</div>
                <div className="user-menu-item">Logout</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
