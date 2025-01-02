import axios from "axios";
import "./css/css.css";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ketNoi, modulePhanQuyen } from "../data/module";

export default function DangNhap() {
  const navigation = useNavigate();
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

    try {
      const {
        status,
        data: { response, type, data, role },
      } = await axios.post(`${ketNoi.url}/nguoi-dung/dang-nhap`, user, {
        withCredentials: true,
      });
      if (status === 200) {
        if (type) {
          localStorage.setItem("role", data);
          if (
            role === modulePhanQuyen.admin ||
            role === modulePhanQuyen.quanLy
          ) {
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
        toast.error(response);
      }
    } catch (error) {
      toast.error("Lỗi hệ thống");
    }
  }

  return (
    <div className="login-container">
      <ToastContainer
        position="bottom-right"
        autoClose={200}
        hideProgressBar={false}
      />
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
