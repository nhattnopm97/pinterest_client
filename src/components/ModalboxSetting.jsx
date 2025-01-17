import React, { useState } from "react";
import "../css/modalboxsetting.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ModalboxSetting(props) {
  const navigate = useNavigate();
  const [isOpenModalSetting, setIsOpenModalSetting] = useState(
    props.openModalSetting
  );
  const handleCloseSettingModal = () => {
    setIsOpenModalSetting(false);
    props.setOpenModalSetting(false);
  };
  const handleModalContentClick = (event) => {
    event.stopPropagation();
  };

  const handleLogout = () => {
    localStorage.removeItem("userLocal");
    console.log("aaaa");
    handleCloseSettingModal();
    navigate("/login");
  };
  return (
    <div>
      <>
        {/* The Modal */}
        <div
          className="modal"
          style={
            isOpenModalSetting ? { display: "block" } : { display: "none" }
          }
          onClick={handleCloseSettingModal}
        >
          {/* Modal content */}
          <div className="modalContent" onClick={handleModalContentClick}>
            <div className="ml-4">
              {props.userLogin === null ? (
                <div className="settingWrapper">
                  <Link to="/login">
                    <div className="settingLogin">Đăng Nhập</div>
                  </Link>
                  <Link to="/register">
                    <div className="settingRegister">Đăng Ký</div>
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="LoginStatus">Đang đăng nhập</div>
                  <div className="infoLoginA">
                    <div className="imgWrapper">
                      <img
                        src={
                          props.userLogin.avartar.length > 0
                            ? props.userLogin.avartar
                            : ""
                        }
                        alt=""
                      />
                    </div>
                    <Link className=" no-underline" to={`/profile/${props.userLogin.id}`}>
                      <div
                        className="hahahahahi"
                        style={{ cursor: "pointer", width: "100%" }}
                      >
                        <div className="ml-3 text-red-500">{props.userLogin.name}</div>
                        <div className="ml-3">{props.userLogin.email}</div>
                      </div>
                    </Link>
                  </div>
                  <Link to="/login" onClick={handleLogout}>
                    <div className="no-underline mt-2">Đăng xuất</div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default ModalboxSetting;
