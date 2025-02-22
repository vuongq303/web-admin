import "./css/css.css";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { listPhanQuyen } from "../data/module";
import Loading from "./components/loading";
import { REQUEST } from "../api/method";

export default function DangNhap() {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const username = useRef();
  const password = useRef();
  const btnLogin = useRef();

  useEffect(() => {
    document.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        btnLogin.current.click();
      }
    });
  }, []);

  async function loginForm() {
    const user = {
      username: username.current.value,
      password: password.current.value,
    };

    if (user.username === "" || user.password === "") {
      toast.error("Kiểm tra lại thông tin");
      return;
    }

    setLoading(true);
    try {
      const {
        data: { response, status, phan_quyen },
      } = await REQUEST.post("/nguoi-dung/dang-nhap", user);
      setLoading(false);
      toast.success(response);

      if (status) {
        if (phan_quyen === 2 || phan_quyen === 3 || phan_quyen === 4) {
          navigation("/nguoi-dung");
          return;
        }

        if (phan_quyen === 0) {
          navigation("/can-ho");
          return;
        }

        if (phan_quyen === 1) {
          navigation("/cham-soc-khach-hang");
          return;
        }
      }
    } catch (error) {
      setLoading(false);
      toast.error("Lỗi hệ thống");
    }
  }

  return (
    <div className="login-container">
      <ToastContainer
        position="bottom-right"
        autoClose={500}
        hideProgressBar={false}
      />
      <Loading loading={loading} />
      <div className="login-content">
        <div className="login-image">
          <img
            src={require("../assets/img/connect_home.png")}
            height={500}
            width={500}
            alt="Logo"
          />
        </div>
        <div className="login-box">
          <h2>Đăng nhập hệ thống</h2>
          <input
            ref={username}
            className="login-input"
            placeholder="Tài khoản"
          />
          <input
            ref={password}
            className="login-input"
            type="password"
            placeholder="Mật khẩu"
          />
          <button ref={btnLogin} onClick={loginForm} className="login-button">
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
