import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import json_config from "../config.json";
import { getRoleNguoiDung } from "../services/utils";
import Loading from "./components/loading";
import { Button, Modal } from "react-bootstrap";
import PreviewImage from "./components/preview_image";
import { downloadImages } from "./controllers/function";
import { toast, ToastContainer } from "react-toastify";

export default function CanHoDaDuyet() {
  const [data, setData] = useState([]);
  const [showModalHinhAnh, setShowModalHinhAnh] = useState(false);
  const [showImageData, setShowImageData] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [loading, setLoading] = useState(true);
  const hinhAnhRef = useRef(null);

  async function capNhatAnhCanHo(event) {
    try {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      const formData = new FormData();
      formData.append("id", dataUpdate.can_ho);
      files.forEach((file) => {
        formData.append("hinh_anh", file);
      });

      const {
        status,
        data: { response: message, data: images, type },
      } = await axios.post(
        `${json_config.url_connect}/can-ho/them-anh-can-ho`,
        formData
      );

      if (status === 200) {
        toast.success(message);
        if (type) {
          setShowImageData(
            images.map(
              (img) =>
                `${json_config.url_connect}/can-ho/${dataUpdate.can_ho}/${img}`
            )
          );
          setData((prevData) =>
            prevData.map((item) =>
              item.can_ho === dataUpdate.can_ho
                ? { ...item, hinh_anh: images.join(",") }
                : item
            )
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  function showImage(item) {
    if (item.hinh_anh) {
      let arrayHinhAnh = item.hinh_anh.split(",");
      setShowImageData(
        arrayHinhAnh.map(
          (img) => `${json_config.url_connect}/can-ho/${item.can_ho}/${img}`
        )
      );
    } else {
      setShowImageData([]);
    }
    setDataUpdate(item);
    setShowModalHinhAnh(true);
  }

  useEffect(() => {
    (async function getData() {
      try {
        const { data } = await axios.get(
          `${json_config.url_connect}/yeu-cau/danh-sach-duyet-yeu-cau`,
          {
            headers: {
              Authorization: getRoleNguoiDung(),
              "Content-Type": "application/json",
            },
          }
        );
        setLoading(false);
        setData(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={200}
        hideProgressBar={false}
      />
      <Loading loading={loading} />
      <Modal
        className="modal-lg"
        show={showModalHinhAnh}
        scrollable
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Hình ảnh</Modal.Title>
          <Button
            variant="close"
            aria-label="Close"
            onClick={() => setShowModalHinhAnh(false)}
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <div className="form-floating mb-3">
            <input
              aria-label="123"
              className="form-control"
              type="file"
              multiple
              id="fileInput"
              ref={hinhAnhRef}
              onChange={capNhatAnhCanHo}
            />
            <label htmlFor="fileInput">Thêm ảnh mới</label>
          </div>
          <div className="form-floating image-container">
            <PreviewImage props={showImageData} onRemoveImage={(i) => {}} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalHinhAnh(false)}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={async () => downloadImages(showImageData)}
          >
            Tải ảnh xuống
          </Button>
        </Modal.Footer>
      </Modal>
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
            <tr key={index}>
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
              <td className="align-middle" style={{ width: "10%" }}>
                {item.chu_can_ho ?? "x"}
              </td>
              <td className="align-middle" style={{ width: "10%" }}>
                {item.so_dien_thoai ?? "x"}
              </td>
              <td className="align-middle">
                {item.gia_ban.toLocaleString("en-US")}
              </td>
              <td className="align-middle">
                {item.gia_thue.toLocaleString("en-US")}
              </td>
              <td className="w-25 text-start align-middle">
                - {item.ten_du_an} - {item.dien_tich}m² - {item.so_phong_ngu}PN
                {item.so_phong_tam}WC - {item.huong_can_ho}
                <br />- {item.loai_can_ho}
                <br />- {item.noi_that}
                <br />- {item.ghi_chu}
              </td>
              <td className="align-middle">
                Trạng thái:
                <strong>
                  {item.trang_thai === 0 ? " Đang chờ" : " Đã duyệt"}
                </strong>
                <br />
                Đã gửi bởi: <strong>{item.nguoi_gui}</strong>
              </td>
              <td className="align-middle">
                <button
                  onClick={() => showImage(item)}
                  type="button"
                  className={`btn w-75 ${
                    item.hinh_anh ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  Hình ảnh
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
