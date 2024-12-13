import React, { useEffect, useRef, useState } from "react";
import "./css/css.css";
import axios from "axios";
import json_config from "../config.json";
import { Button, Modal } from "react-bootstrap";
import {
  dataDuAn,
  dataHuongCanHo,
  dataLoaiCanHo,
  dataNoiThat,
  dataToaNha,
  loaiGiaoDichKhachHang,
} from "../services/utils";
import PreviewImage from "./components/preview_image";
import { toast, ToastContainer } from "react-toastify";

export default function CanHo() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [showImageUpdate, setShowImageUpdate] = useState([]);
  const [showImage, setShowImage] = useState([]);

  const tenToaNhaRef = useRef(null);
  const maCanHoRef = useRef(null);
  const hoTenChuCanHoRef = useRef(null);
  const soDienThoaiRef = useRef(null);
  const loaiGiaoDichRef = useRef(null);
  const tenDuAnRef = useRef(null);
  const soPhongNguRef = useRef(null);
  const soPhongTamRef = useRef(null);
  const loaiCanHoRef = useRef(null);
  const dienTichRef = useRef(null);
  const huongBanCongRef = useRef(null);
  const noiThatRef = useRef(null);
  const giaBanRef = useRef(null);
  const giaThueRef = useRef(null);
  const ghiChuRef = useRef(null);
  const hinhAnhRef = useRef(null);

  async function getData() {
    const { data } = await axios.get(`${json_config.url_connect}/can-ho`);
    setData(data);
  }

  const removeImageModalAdd = async (index) => {
    const dataTransfer = new DataTransfer();
    const newImages = showImage.filter((src) => src.index !== index);

    await Promise.all(
      newImages.map(async (src) => {
        const response = await fetch(src.data);
        const blob = await response.blob();
        const file = new File([blob], `image${src.index}.png`, {
          type: "image/png",
        });
        dataTransfer.items.add(file);
      })
    );

    hinhAnhRef.current.files = dataTransfer.files;
    setShowImage(newImages);
  };

  async function themCanHo() {
    try {
      const tenToaNha = tenToaNhaRef.current.value;
      const maCanHo = maCanHoRef.current.value;
      const hoTenChuCanHo = hoTenChuCanHoRef.current.value;
      const soDienThoai = soDienThoaiRef.current.value;
      const loaiGiaoDich = loaiGiaoDichRef.current.value;
      const tenDuAn = tenDuAnRef.current.value;
      const soPhongNgu = soPhongNguRef.current.value;
      const soPhongTam = soPhongTamRef.current.value;
      const loaiCanHo = loaiCanHoRef.current.value;
      const dienTich = dienTichRef.current.value;
      const huongBanCong = huongBanCongRef.current.value;
      const noiThat = noiThatRef.current.value;
      const giaBan = giaBanRef.current.value;
      const giaThue = giaThueRef.current.value;
      const ghiChu = ghiChuRef.current.value;
      const hinhAnh = hinhAnhRef.current.files;

      // if (
      //   hoTenChuCanHo === "" ||
      //   soDienThoai === "" ||
      //   maCanHo === "" ||
      //   tenDuAn === "" ||
      //   soPhongNgu < 0 ||
      //   soPhongNgu === "" ||
      //   soPhongTam < 0 ||
      //   soPhongTam === "" ||
      //   dienTich < 0 ||
      //   dienTich === "" ||
      //   giaBan < 0 ||
      //   giaBan === "" ||
      //   giaThue < 0 ||
      //   giaThue === "" ||
      //   ghiChu === ""
      // ) {
      //   toast.error("Dữ liệu trống");
      //   return;
      // }
      const formData = new FormData();
      formData.append("ten_khach_hang", hoTenChuCanHo);
      formData.append("so_dien_thoai", soDienThoai);
      formData.append("toa_nha", tenToaNha);
      formData.append("ma_can_ho", maCanHo);
      formData.append("loai_giao_dich", loaiGiaoDich);
      formData.append("ngay_ki_hop_dong", new Date().toISOString());
      formData.append("ghi_chu_khach_hang", "");
      formData.append("ten_du_an", tenDuAn);
      formData.append("dien_tich", dienTich);
      formData.append("so_phong_ngu", soPhongNgu);
      formData.append("so_phong_tam", soPhongTam);
      formData.append("huong_can_ho", huongBanCong);
      formData.append("loai_can_ho", loaiCanHo);
      formData.append("noi_that", noiThat);
      formData.append("mo_ta", ghiChu);
      formData.append("nguoi_cap_nhat", 1);
      formData.append("gia_ban", giaBan);
      formData.append("gia_thue", giaThue);
      Array.from(hinhAnh).map((file) => {
        formData.append("hinh_anh", file);
      });

      const {
        data: { response, type },
        status,
      } = await axios.post(
        `${json_config.url_connect}/can-ho/them-can-ho`,
        formData
      );
      if (status === 200) {
        toast.success(response);
        if (type) await getData();
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
      <div className="d-flex justify-content-start m-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setShowImage([]);
            setShowModal(true);
          }}
        >
          Thêm mới
        </button>
        {/*  */}
        <Modal
          className="modal-lg"
          show={showModal}
          scrollable
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Thêm dự án mới</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <label className="mb-3">Thông tin khách hàng</label>
            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  ref={tenToaNhaRef}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataToaNha().map((item, index) => (
                    <option key={item.id} value={item.id}>
                      {item.ten_toa_nha}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Tên tòa</label>
              </div>
              <div className="form-floating">
                <input
                  ref={maCanHoRef}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Mã căn hộ</label>
              </div>
              <div className="form-floating">
                <input
                  ref={hoTenChuCanHoRef}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Họ tên chủ căn hộ</label>
              </div>
            </div>
            <div className="input-group mb-3">
              <div className="form-floating">
                <input
                  ref={soDienThoaiRef}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Số điện thoại</label>
              </div>
              <div className="form-floating">
                <select
                  className="form-select"
                  ref={loaiGiaoDichRef}
                  aria-label="Default select example"
                >
                  {loaiGiaoDichKhachHang.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Loại giao dịch</label>
              </div>
            </div>
            <label className="mb-3">Thông tin căn hộ</label>
            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  ref={tenDuAnRef}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataDuAn().map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.ten_du_an}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Tên dự án</label>
              </div>

              <div className="form-floating">
                <input
                  ref={soPhongNguRef}
                  type="number"
                  defaultValue={0}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Số phòng ngủ</label>
              </div>
              <div className="form-floating">
                <input
                  ref={soPhongTamRef}
                  type="number"
                  defaultValue={0}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Số phòng tắm</label>
              </div>
            </div>
            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  ref={loaiCanHoRef}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataLoaiCanHo().map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.loai_can_ho}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Loại căn hộ</label>
              </div>

              <div className="form-floating">
                <input
                  ref={dienTichRef}
                  type="number"
                  defaultValue={0}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Diện tích (m²)</label>
              </div>
              <div className="form-floating">
                <select
                  ref={huongBanCongRef}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataHuongCanHo().map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.huong_can_ho}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Hướng ban công</label>
              </div>
            </div>
            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  ref={noiThatRef}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataNoiThat().map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.loai_noi_that}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Nội thất</label>
              </div>
              <div className="form-floating">
                <input
                  ref={giaBanRef}
                  type="number"
                  defaultValue={0}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Giá bán</label>
              </div>
              <div className="form-floating">
                <input
                  ref={giaThueRef}
                  type="number"
                  defaultValue={0}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Giá thuê</label>
              </div>
            </div>
            <div className="form-floating">
              <input
                ref={ghiChuRef}
                type="text"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
              <label htmlFor="floatingInputGrid">Ghi chú</label>
            </div>
            <div className="form-floating mb-3">
              <input
                aria-label="123"
                className="form-control"
                type="file"
                multiple
                id="fileInput"
                ref={hinhAnhRef}
                onChange={(event) => {
                  setShowImage([]);
                  const files = Array.from(event.target.files);
                  files.forEach((file, index) => {
                    const fileURL = URL.createObjectURL(file);
                    setShowImage((pre) => [...pre, { index, data: fileURL }]);
                  });
                }}
              />
              <label htmlFor="fileInput">Thông tin ảnh</label>
            </div>
            <div className="form-floating image-container">
              <PreviewImage
                props={showImage}
                onRemoveImage={removeImageModalAdd}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button onClick={themCanHo} variant="primary">
              Thêm mới
            </Button>
          </Modal.Footer>
        </Modal>
        {/*  */}
        <Modal show={showModalUpdate} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>Cập nhật dự án</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModalUpdate(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <div className="form-floating">
              <select
                className="form-select"
                aria-label="Default select example"
              >
                {dataHuongCanHo().map((item, index) => (
                  <option key={item.id} value={item.id}>
                    {item.huong_can_ho}
                  </option>
                ))}
              </select>
              <label htmlFor="floatingInputGrid">Hướng ban công</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModalUpdate(false)}
            >
              Close
            </Button>
            <Button variant="primary">Cập nhật</Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/*  */}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">STT</th>
            <th scope="col">Căn hộ</th>
            <th scope="col">Chủ căn hộ</th>
            <th scope="col">Số điện thoại</th>
            <th scope="col">Giá bán</th>
            <th scope="col">Giá thuê</th>
            <th scope="col">Thông tin bất động sản</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.ten_can_ho}</td>
              <td>{item.chu_can_ho}</td>
              <td>{item.so_dien_thoai}</td>
              <td>{item.gia_ban}</td>
              <td>{item.gia_thue}</td>
              <td>{item.thong_tin_can_ho}</td>

              <td>
                <button type="button" className="btn btn-primary">
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
