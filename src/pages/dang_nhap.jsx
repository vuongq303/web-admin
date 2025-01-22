import "./css/css.css";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { modulePhanQuyen } from "../data/module";
import Loading from "./components/loading";
import { REQUEST } from "../api/method";

export default function DangNhap() {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const username = useRef();
  const password = useRef();
  const btnLogin = useRef();

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
        data: { response, status, token, role },
      } = await REQUEST.post("/nguoi-dung/dang-nhap", user);

      toast.success(response);
      if (status) {
        localStorage.setItem("role", token);
        setLoading(false);

        if (role === modulePhanQuyen.admin || role === modulePhanQuyen.quanLy) {
          navigation("/nguoi-dung");
          return;
        }

        if (role === modulePhanQuyen.sale) {
          navigation("/can-ho");
          return;
        }

        if (role === modulePhanQuyen.cskh) {
          navigation("/cham-soc-khach-hang");
          return;
        }
      }
    } catch (error) {
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
            src={require("../imgs/connect_home.png")}
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
