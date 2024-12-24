import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getRoleNguoiDung } from "../services/utils";
import { toast, ToastContainer } from "react-toastify";
import Loading from "./components/loading";
import { downloadImages } from "./controllers/function";
import PreviewImage from "./components/preview_image";
import { Button, Modal } from "react-bootstrap";
import { ketNoi, modulePhanQuyen } from "../data/module";

export default function CanHoDaGui() {
  const [data, setData] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [showModalHinhAnh, setShowModalHinhAnh] = useState(false);
  const [showImageData, setShowImageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
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
      } = await axios.post(`${ketNoi.url}/can-ho/them-anh-can-ho`, formData);

      if (status === 200) {
        toast.success(message);
        if (type) {
          setShowImageData(
            images.map(
              (img) => `${ketNoi.url}/can-ho/${dataUpdate.can_ho}/${img}`
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

  const xoaAnhCanHo = async (index) => {
    if (role !== modulePhanQuyen.admin && role !== modulePhanQuyen.quanLy) {
      toast.error("Bạn không thể xóa ảnh");
      return;
    }

    const listImgPath = showImageData[index].split("/");
    const imgPath = listImgPath[listImgPath.length - 1];

    try {
      const {
        status,
        data: { response: message, data: images, type },
      } = await axios.post(`${ketNoi.url}/can-ho/xoa-anh-can-ho`, {
        id: dataUpdate.can_ho,
        filename: imgPath,
      });

      if (status === 200) {
        toast.success(message);
        if (type) {
          setShowImageData(
            images.map(
              (img) => `${ketNoi.url}/can-ho/${dataUpdate.can_ho}/${img}`
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
      console.log(error);
    }
  };

  function showImage(item) {
    if (item.hinh_anh) {
      let arrayHinhAnh = item.hinh_anh.split(",");
      setShowImageData(
        arrayHinhAnh.map((img) => `${ketNoi.url}/can-ho/${item.can_ho}/${img}`)
      );
    } else {
      setShowImageData([]);
    }
    setDataUpdate(item);
    setShowModalHinhAnh(true);
  }

  async function duyetYeuCau(id) {
    setLoading(true);
    try {
      const {
        status,
        data: { response, type },
      } = await axios.post(
        `${ketNoi.url}/yeu-cau/duyet-yeu-cau`,
        { id: id },
        {
          headers: {
            Authorization: getRoleNguoiDung(),
            "Content-Type": "application/json",
          },
        }
      );
      if (status === 200) {
        setLoading(false);
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
    (async function getData() {
      try {
        const {
          data: { response, role },
        } = await axios.get(`${ketNoi.url}/yeu-cau/danh-sach-gui-yeu-cau`, {
          headers: {
            Authorization: getRoleNguoiDung(),
            "Content-Type": "application/json",
          },
        });
        setLoading(false);
        setData(response);
        setRole(role);
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
            <PreviewImage props={showImageData} onRemoveImage={xoaAnhCanHo} />
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
      <table className="table table-striped table-bordered">
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
                  {item.ten_toa_nha}-{item.ma_can_ho ?? "x"}
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
              <td className="align-middle" style={{ width: "15%" }}>
                Trạng thái:
                <strong>
                  {item.trang_thai === 0 ? " Đang chờ" : " Đã duyệt"}
                </strong>
                <br />
                Đã gửi bởi: <strong>{item.nguoi_gui}</strong> <br />
                <strong>{item.thong_tin}</strong>
              </td>
              <td className="align-middle">
                <button
                  onClick={() => showImage(item)}
                  type="button"
                  className={`btn w-75 ${
                    item.hinh_anh ? "btn-warning" : "btn-secondary"
                  }`}
                >
                  Hình ảnh
                </button>
                <br />
                {role !== modulePhanQuyen.nhanVien && (
                  <button
                    type="button"
                    onClick={() => duyetYeuCau(item.id)}
                    className="btn w-75 btn-primary my-2"
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
