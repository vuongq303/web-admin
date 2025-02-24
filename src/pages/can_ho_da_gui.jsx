import React, { useEffect, useRef, useState } from "react";
import { encodeId, trangThaiYeuCau } from "../services/utils";
import { toast, ToastContainer } from "react-toastify";
import Loading from "./components/loading";
import { authentication, copyTextToClipBoard, downloadImages, typeId } from "./controllers/function";
import PreviewImage from "./components/preview_image";
import { Button, Modal } from "react-bootstrap";
import { baseURL } from "../data/module";
import { REQUEST } from "../api/method";
import { useNavigate } from "react-router-dom";

export default function CanHoDaGui() {
  const [data, setData] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [showModalHinhAnh, setShowModalHinhAnh] = useState(false);
  const [showImageData, setShowImageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const hinhAnhRef = useRef(null);
  const navigation = useNavigate();

  async function capNhatAnhCanHo(event) {
    try {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      const formData = new FormData();
      formData.append("id", dataUpdate.can_ho);
      files.forEach((file) => {
        formData.append("hinh_anh", file);
      });

      setLoading(true);
      const {
        data: { response: message, data: images, status },
      } = await REQUEST.post("/can-ho/them-anh-can-ho", formData);
      setLoading(false);
      toast.success(message);

      if (status) {
        setShowImageData(
          images.map((img) => `${baseURL}/can-ho/${dataUpdate.can_ho}/${img}`)
        );
        setData((prevData) =>
          prevData.map((item) =>
            item.can_ho === dataUpdate.can_ho
              ? { ...item, hinh_anh: images.join(",") }
              : item
          )
        );
      }
    } catch ({
      response: {
        data: { response },
      },
    }) {
      setLoading(false);
      toast.error(response);
    }
  }

  const xoaAnhCanHo = async (index) => {
    if (!isAdmin) {
      toast.error("Bạn không thể xóa ảnh");
      return;
    }

    const listImgPath = showImageData[index].split("/");
    const imgPath = listImgPath[listImgPath.length - 1];
    setLoading(true);

    try {
      const {
        data: { response: message, data: images, status },
      } = await REQUEST.post("/can-ho/xoa-anh-can-ho", {
        id: dataUpdate.can_ho,
        filename: imgPath,
      });
      setLoading(false);
      toast.success(message);

      if (status) {
        setShowImageData(
          images.map((img) => `${baseURL}/can-ho/${dataUpdate.can_ho}/${img}`)
        );
        setData((prevData) =>
          prevData.map((item) =>
            item.can_ho === dataUpdate.can_ho
              ? { ...item, hinh_anh: images.join(",") }
              : item
          )
        );
      }
    } catch ({
      response: {
        data: { response },
      },
    }) {
      setLoading(false);
      toast.error(response);
    }
  };

  function showImage(item) {
    if (item.hinh_anh) {
      let arrayHinhAnh = item.hinh_anh.split(",");
      setShowImageData(
        arrayHinhAnh.map((img) => `${baseURL}/can-ho/${item.can_ho}/${img}`)
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
        data: { response, status },
      } = await REQUEST.post("/yeu-cau/duyet-yeu-cau", { id: id });
      setLoading(false);
      toast.success(response);

      if (status) {
        setData((pre) => pre.filter((item) => item.id !== id));
      }
    } catch ({
      response: {
        data: { response },
      },
    }) {
      setLoading(false);
      toast.error(response);
    }
  }

  useEffect(() => {
    (async function getData() {
      try {
        const {
          data: { data, isAdmin, status },
        } = await REQUEST.get("/yeu-cau/danh-sach-gui-yeu-cau");
        setLoading(false);
        if (status) {
          setData(data);
          setIsAdmin(isAdmin);
        }
      } catch ({
        response: {
          data: { response },
        },
      }) {
        authentication(navigation, response, toast);
      }
    })();
  }, []);

  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
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
          <div className="form-floating mb-3" style={{ zIndex: 1 }}>
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
            onClick={async () => downloadImages(showImageData, dataUpdate)}
          >
            Tải ảnh xuống
          </Button>
        </Modal.Footer>
      </Modal>
      <table className="table table-hover table-bordered">
        <thead>
          <tr className="table-primary">
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
          {data.map((item, index) => {
            const styles = {
              ma_can_ho: {
                display: "inline-block",
                backgroundColor: item.danh_dau,
                padding: "1px 5px",
                borderRadius: "5px",
              },
              w_10: { width: "10%" },
              w_15: { width: "15%" },
              w_5: { width: "5%" },
              f_: { fontSize: 12 },
              row: { cursor: 'pointer' }
            };
            return (
              <tr key={item.id} style={styles.row}
                onClick={() => copyTextToClipBoard(encodeId(item.id), toast)}>
                <td className="align-middle">{index + 1}</td>
                <td className="align-middle text-bold" style={styles.w_5}>
                  <strong>
                    <div style={styles.ma_can_ho}>
                      {item.ten_toa_nha}-{item.ma_can_ho ?? "x"}{item.truc_can_ho}
                    </div>
                  </strong> <br />
                  {encodeId(item.ma_can_ho)}
                </td>
                <td className="align-middle" style={styles.w_10}>
                  {item.chu_can_ho ?? "x"}
                </td>
                <td className="align-middle" style={styles.w_10}>
                  {item.so_dien_thoai ?? "x"}
                </td>
                <td className="align-middle">
                  {item.gia_ban.toLocaleString("en-US")}
                </td>
                <td className="align-middle">
                  {item.gia_thue.toLocaleString("en-US")}
                </td>
                <td className="w-25 text-start align-middle">
                  - {item.ten_du_an} - {item.dien_tich}m² - {item.so_phong_ngu}
                  PN
                  {item.so_phong_tam}WC - {item.huong_can_ho}
                  <br />- {item.loai_can_ho}
                  <br />- {item.noi_that}
                  <br />- {item.ghi_chu}
                </td>
                <td className="align-middle" style={styles.w_15}>
                  Trạng thái:
                  <strong>{trangThaiYeuCau[item.trang_thai]}</strong>
                  <br />
                  Đã gửi bởi: <strong>{item.nguoi_gui}</strong> <br />
                  <strong>{item.thong_tin}</strong>
                </td>
                <td className="align-middle">
                  <button
                    onClick={() => showImage(item)}
                    type="button"
                    style={styles.f_}
                    className={`btn w-75 ${item.hinh_anh ? "btn-warning" : "btn-secondary"
                      }`}
                  >
                    Hình ảnh
                  </button>
                  <br />
                  {isAdmin && (
                    <button
                      style={styles.f_}
                      type="button"
                      onClick={() => duyetYeuCau(item.id)}
                      className="btn w-75 btn-primary my-2"
                    >
                      Duyệt
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
