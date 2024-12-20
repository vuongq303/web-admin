import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import json_config from "../config.json";
import { getRoleNguoiDung } from "../services/utils";
import { toast, ToastContainer } from "react-toastify";

export default function CanHoDaGui() {
  const [data, setData] = useState([]);
  const [role, setRole] = useState("");

  async function getData() {
    try {
      const {
        data: { response, role },
      } = await axios.get(
        `${json_config.url_connect}/yeu-cau/danh-sach-gui-yeu-cau`,
        {
          headers: {
            Authorization: getRoleNguoiDung(),
            "Content-Type": "application/json",
          },
        }
      );

      setData(response);
      setRole(role);
    } catch (error) {
      console.log(error);
    }
  }

  async function xoaYeuCau(id) {
    try {
      const {
        status,
        data: { response, type },
      } = await axios.post(`${json_config.url_connect}/yeu-cau/xoa-yeu-cau`, {
        id,
      });
      if (status === 200) {
        if (type) {
          toast.success(response);
          setData((pre) => pre.filter((item) => item.id !== id));
          return;
        }
        toast.error(response);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function duyetYeuCau(id) {
    try {
      const {
        status,
        data: { response, type },
      } = await axios.post(
        `${json_config.url_connect}/yeu-cau/duyet-yeu-cau`,
        { id: id },
        {
          headers: {
            Authorization: getRoleNguoiDung(),
            "Content-Type": "application/json",
          },
        }
      );
      if (status === 200) {
        toast.success(response);
        if (type) {
          setData((pre) => pre.filter((item) => item.id !== id));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={200}
        hideProgressBar={false}
      />
      <table className="table table-light table-sm">
        <thead>
          <tr>
            <th scope="col">STT</th>
            <th scope="col">Căn hộ</th>
            <th scope="col">Chủ căn hộ</th>
            <th scope="col">Số điện thoại</th>
            <th scope="col">Giá bán</th>
            <th scope="col">Giá thuê</th>
            <th scope="col">Thông tin căn hộ</th>
            <th scope="col">Thông tin yêu cầu</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td className="align-middle">{index + 1}</td>
              <td className="align-middle">
                <div
                  style={{
                    display: "inline-block",
                    backgroundColor: item.danh_dau,
                    padding: "1px 5px",
                    borderRadius: "5px",
                  }}
                >
                  {item.ten_toa_nha}-{item.ma_can_ho ?? "*"}
                  {item.truc_can_ho}
                </div>
              </td>
              <td className="align-middle">{item.chu_can_ho ?? "*"}</td>
              <td className="align-middle">{item.so_dien_thoai ?? "*"}</td>
              <td className="align-middle">{item.gia_ban}</td>
              <td className="align-middle">{item.gia_thue}</td>
              <td className="w-25 text-start align-middle">
                - {item.du_an} - {item.dien_tich}m² - {item.so_phong_ngu}PN
                {item.so_phong_tam}WC - {item.huong_can_ho}
                <br />- {item.loai_can_ho}
                <br />- {item.noi_that}
                <br />- {item.ghi_chu}
              </td>
              <td className="align-middle">
                Trạng thái: <strong>{item.trang_thai}</strong> <br />
                Đã gửi bởi: <strong>{item.nguoi_gui}</strong>
              </td>
              <td className="align-middle">
                <button
                  onClick={() => xoaYeuCau(item.id)}
                  type="button"
                  className="btn btn-danger my-2"
                >
                  Xóa
                </button>
                <br />
                {role !== "Nhân viên" && (
                  <button
                    type="button"
                    onClick={() => duyetYeuCau(item.id)}
                    className="btn btn-primary my-2"
                  >
                    Duyệt
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
