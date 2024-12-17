import React, { useEffect, useRef, useState } from "react";
import "./css/css.css";
import axios from "axios";
import json_config from "../config.json";
import { Button, Modal } from "react-bootstrap";
import {
  danhDauCanHo,
  dataDuAn,
  dataHuongCanHo,
  dataLoaiCanHo,
  dataNoiThat,
  dataToaNha,
  dataTrucCanHo,
  getRoleNguoiDung,
  loaiGiaoDichKhachHang,
  locGiaCanHo,
  trangThaiDuAn,
} from "../services/utils";
import PreviewImage from "./components/preview_image";
import { toast, ToastContainer } from "react-toastify";
import "./css/css.css";
import { dataCanHoDefault } from "../data/default_data";

export default function CanHo() {
  const [data, setData] = useState([]);
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalHinhAnh, setShowModalHinhAnh] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(dataCanHoDefault);
  const [showImageUpdate, setShowImageUpdate] = useState([]);

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
  const trangThaiDuAnRef = useRef(null);
  const trucCanHoRef = useRef(null);
  const locGiaCanHoRef = useRef(null);
  const giaBanTuRef = useRef(null);
  const giaBanDenRef = useRef(null);
  const giaThueTuRef = useRef(null);
  const giaThueDenRef = useRef(null);
  const danhDauCanHoRef = useRef(null);

  async function guiYeuCau(id) {
    const {
      status,
      data: { response, type },
    } = await axios.post(
      `${json_config.url_connect}/yeu-cau/gui-yeu-cau`,
      { can_ho: id },
      {
        headers: {
          Authorization: getRoleNguoiDung(),
          "Content-Type": "application/json",
        },
      }
    );
    if (status === 200) {
      if (type) {
        toast.success(response);
        return;
      }
      toast.error(response);
      return;
    }
  }

  async function getData() {
    try {
      const {
        data: { response, role },
      } = await axios.get(`${json_config.url_connect}/can-ho`, {
        headers: {
          Authorization: getRoleNguoiDung(),
          "Content-Type": "application/json",
        },
      });
      setRole(role);
      setData(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function timKiem() {
    let dataTimKiem = {
      ten_du_an: tenDuAnRef.current.value,
      ten_toa_nha: tenToaNhaRef.current.value,
      loai_noi_that: noiThatRef.current.value,
      loai_can_ho: loaiCanHoRef.current.value,
      huong_can_ho: huongBanCongRef.current.value,
      so_phong_ngu: soPhongNguRef.current.value,
      truc_can_ho: trucCanHoRef.current.value,
      loc_gia: locGiaCanHoRef.current.value,
      gia_ban_tu: giaBanTuRef.current.value,
      gia_ban_den: giaBanDenRef.current.value,
      gia_thue_tu: giaThueTuRef.current.value,
      gia_thue_den: giaThueDenRef.current.value,
    };

    const { status, data } = await axios.get(
      `${json_config.url_connect}/tim-kiem`,
      {
        params: dataTimKiem,
        headers: {
          Authorization: getRoleNguoiDung(),
          "Content-Type": "application/json",
        },
      }
    );

    if (status === 200) {
      setData(data);
    }
  }

  async function lamMoi() {
    tenDuAnRef.current.value = "";
    tenDuAnRef.current.value = "";
    tenToaNhaRef.current.value = "";
    noiThatRef.current.value = "";
    loaiCanHoRef.current.value = "";
    huongBanCongRef.current.value = "";
    soPhongNguRef.current.value = "";
    trucCanHoRef.current.value = "";
    locGiaCanHoRef.current.value = "";
    giaBanTuRef.current.value = "";
    giaBanDenRef.current.value = "";
    giaThueTuRef.current.value = "";
    giaThueDenRef.current.value = "";
    await getData();
  }

  async function capNhatAnhCanHo(event) {
    try {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      const formData = new FormData();
      formData.append("id", dataUpdate.id);
      files.forEach((file) => {
        formData.append("hinh_anh", file);
      });

      const response = await axios.post(
        `${json_config.url_connect}/can-ho/them-anh-can-ho`,
        formData
      );

      const {
        status,
        data: { response: message, data: images, type },
      } = response;

      if (status === 200) {
        toast.success(message);
        if (type) {
          setShowImageUpdate((pre) => [
            ...pre,
            ...images.map(
              (img) =>
                `${json_config.url_connect}/can-ho/${dataUpdate.id}/${img}`
            ),
          ]);
          setData((prevData) =>
            prevData.map((item) =>
              item.ma_can_ho === dataUpdate.ma_can_ho
                ? { ...item, hinh_anh: item.hinh_anh + "," + images.join(",") }
                : item
            )
          );
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật ảnh thất bại. Vui lòng thử lại!");
    }
  }

  const removeImageModalUpdate = async (index) => {
    if (role !== "Admin") {
      toast.error("Bạn không thể xóa ảnh");
      return;
    }
    const listImgPath = showImageUpdate[index].split("/");
    const imgPath = listImgPath[listImgPath.length - 1];

    try {
      const response = await axios.post(
        `${json_config.url_connect}/can-ho/xoa-anh-can-ho`,
        {
          id: dataUpdate.id,
          filename: imgPath,
        }
      );
      const {
        status,
        data: { response: message, data: images, type },
      } = response;

      if (status === 200) {
        toast.success(message);
        if (type) {
          setShowImageUpdate(
            images.map(
              (img) =>
                `${json_config.url_connect}/can-ho/${dataUpdate.id}/${img}`
            )
          );
          setData((prevData) =>
            prevData.map((item) =>
              item.ma_can_ho === dataUpdate.ma_can_ho
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

  async function themCanHo() {
    try {
      const data = {
        ten_toa_nha: tenToaNhaRef.current.value,
        ma_can_ho: maCanHoRef.current.value,
        chu_can_ho: hoTenChuCanHoRef.current.value,
        so_dien_thoai: soDienThoaiRef.current.value,
        loai_giao_dich: loaiGiaoDichRef.current.value,
        ten_du_an: tenDuAnRef.current.value,
        so_phong_ngu: soPhongNguRef.current.value,
        so_phong_tam: soPhongTamRef.current.value,
        loai_can_ho: loaiCanHoRef.current.value,
        dien_tich: dienTichRef.current.value,
        huong_can_ho: huongBanCongRef.current.value,
        noi_that: noiThatRef.current.value,
        gia_ban: giaBanRef.current.value,
        gia_thue: giaThueRef.current.value,
        mo_ta: ghiChuRef.current.value,
        trang_thai: trangThaiDuAnRef.current.value,
        truc_can_ho: trucCanHoRef.current.value,
        ngay_ki_hop_dong: new Date().toISOString(),
        danh_dau: danhDauCanHoRef.current.value,
      };

      const isInvalidInput = (value, allowNegative = false) =>
        value === "" || (!allowNegative && Number(value) < 0);

      if (
        isInvalidInput(data.ten_khach_hang) ||
        isInvalidInput(data.so_dien_thoai) ||
        isInvalidInput(data.ma_can_ho) ||
        isInvalidInput(data.ten_du_an) ||
        isInvalidInput(data.so_phong_ngu) ||
        isInvalidInput(data.so_phong_tam) ||
        isInvalidInput(data.dien_tich) ||
        isInvalidInput(data.gia_ban) ||
        isInvalidInput(data.gia_thue) ||
        isInvalidInput(data.mo_ta)
      ) {
        toast.error("Kiểm tra lại dữ liệu");
        return;
      }

      const response = await axios.post(
        `${json_config.url_connect}/can-ho/them-can-ho`,
        data,
        {
          headers: {
            Authorization: getRoleNguoiDung(),
            "Content-Type": "application/json",
          },
        }
      );

      const {
        data: { response: message, type },
        status,
      } = response;

      if (status === 200) {
        toast.success(message);
        if (type) {
          setShowModal(false);
          await getData();
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm căn hộ:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    }
  }

  async function capNhatCanHo() {
    try {
      const data = {
        ten_toa_nha: tenToaNhaRef.current.value,
        ma_can_ho: maCanHoRef.current.value,
        chu_can_ho: hoTenChuCanHoRef.current.value,
        so_dien_thoai: soDienThoaiRef.current.value,
        loai_giao_dich: loaiGiaoDichRef.current.value,
        ten_du_an: tenDuAnRef.current.value,
        so_phong_ngu: soPhongNguRef.current.value,
        so_phong_tam: soPhongTamRef.current.value,
        loai_can_ho: loaiCanHoRef.current.value,
        dien_tich: dienTichRef.current.value,
        huong_can_ho: huongBanCongRef.current.value,
        noi_that: noiThatRef.current.value,
        gia_ban: giaBanRef.current.value,
        gia_thue: giaThueRef.current.value,
        mo_ta: ghiChuRef.current.value,
        trang_thai: trangThaiDuAnRef.current.value,
        truc_can_ho: trucCanHoRef.current.value,
        ngay_ki_hop_dong: new Date().toISOString(),
        danh_dau: danhDauCanHoRef.current.value,
        id: dataUpdate.id,
      };

      const isInvalidInput = (value, allowNegative = false) =>
        value === "" || (!allowNegative && Number(value) < 0);

      if (
        isInvalidInput(data.ten_khach_hang) ||
        isInvalidInput(data.so_dien_thoai) ||
        isInvalidInput(data.ma_can_ho) ||
        isInvalidInput(data.ten_du_an) ||
        isInvalidInput(data.so_phong_ngu) ||
        isInvalidInput(data.so_phong_tam) ||
        isInvalidInput(data.dien_tich) ||
        isInvalidInput(data.gia_ban) ||
        isInvalidInput(data.gia_thue) ||
        isInvalidInput(data.mo_ta)
      ) {
        toast.error("Kiểm tra lại dữ liệu");
        return;
      }

      const response = await axios.post(
        `${json_config.url_connect}/can-ho/cap-nhat-can-ho`,
        data,
        {
          headers: {
            Authorization: getRoleNguoiDung(),
            "Content-Type": "application/json",
          },
        }
      );

      const {
        data: { response: message, type },
        status,
      } = response;

      if (status === 200) {
        toast.success(message);
        if (type) {
          setShowModalUpdate(false);
          await getData();
        }
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật căn hộ:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
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
        <div className="d-flex justify-content-between align-items-center w-100">
          {role !== "Nhân viên" ? (
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                Thêm mới
              </button>
              <button type="button" className="btn btn-outline-primary ms-2">
                Nhập dữ liệu excel
              </button>
            </div>
          ) : (
            <div></div>
          )}
          <div className="text-start">
            <strong>Vàng: Căn giá rẻ</strong>
            <br />
            <strong>Đỏ: Căn ngoại giao (Không gọi trực tiếp chủ nhà)</strong>
            <br />
            <strong>Cam (Căn kết hợp)</strong>
          </div>
        </div>
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
                    <option key={item.id} value={item.ten_toa_nha}>
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
                <label htmlFor="floatingInputGrid">Số phòng</label>
              </div>
              <div className="form-floating">
                <select
                  className="form-select"
                  ref={trucCanHoRef}
                  aria-label="Default select example"
                >
                  {dataTrucCanHo().map((item) => (
                    <option key={item.id} value={item.truc_can}>
                      {item.truc_can}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Trục căn hộ</label>
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
              <div className="form-floating">
                <select
                  className="form-select"
                  ref={trangThaiDuAnRef}
                  aria-label="Default select example"
                >
                  {trangThaiDuAn.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Trạng thái</label>
              </div>
              <div className="form-floating">
                <select
                  className="form-select"
                  ref={danhDauCanHoRef}
                  aria-label="Default select example"
                >
                  {danhDauCanHo.map((item, index) => (
                    <option key={index} value={item.mau_sac}>
                      {item.noi_dung}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Đánh dấu</label>
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
                    <option key={item.id} value={item.ten_du_an}>
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
                    <option key={item.id} value={item.loai_can_ho}>
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
                    <option key={item.id} value={item.huong_can_ho}>
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
                    <option key={item.id} value={item.loai_noi_that}>
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
            <div className="form-floating mb-3">
              <input
                ref={ghiChuRef}
                type="text"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
              <label htmlFor="floatingInputGrid">Ghi chú</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button onClick={themCanHo} variant="primary">
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal>
        {/*  */}
        <Modal
          show={showModalUpdate}
          backdrop="static"
          keyboard={false}
          className="modal-lg"
          scrollable
        >
          <Modal.Header>
            <Modal.Title>Chi tiết dự án</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModalUpdate(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <label className="mb-3">Thông tin khách hàng</label>
            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  ref={tenToaNhaRef}
                  defaultValue={dataUpdate.ten_toa_nha}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataToaNha().map((item) => (
                    <option key={item.id} value={item.ten_toa_nha}>
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
                  defaultValue={dataUpdate.ma_can_ho ?? "*"}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Số phòng</label>
              </div>
              <div className="form-floating">
                <select
                  className="form-select"
                  ref={trucCanHoRef}
                  defaultValue={dataUpdate.truc_can_ho}
                  aria-label="Default select example"
                >
                  {dataTrucCanHo().map((item) => (
                    <option key={item.id} value={item.truc_can}>
                      {item.truc_can}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Trục căn hộ</label>
              </div>
              <div className="form-floating">
                <input
                  ref={hoTenChuCanHoRef}
                  defaultValue={dataUpdate.chu_can_ho ?? "*"}
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
                  defaultValue={dataUpdate.so_dien_thoai ?? "*"}
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
                  defaultValue={dataUpdate.loai_giao_dich}
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
              <div className="form-floating">
                <select
                  className="form-select"
                  ref={trangThaiDuAnRef}
                  defaultValue={dataUpdate.trang_thai}
                  aria-label="Default select example"
                >
                  {trangThaiDuAn.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Trạng thái</label>
              </div>
              <div className="form-floating">
                <select
                  className="form-select"
                  ref={danhDauCanHoRef}
                  defaultValue={dataUpdate.danh_dau}
                  aria-label="Default select example"
                >
                  {danhDauCanHo.map((item, index) => (
                    <option key={index} value={item.mau_sac}>
                      {item.noi_dung}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Đánh dấu</label>
              </div>
            </div>
            <label className="mb-3">Thông tin căn hộ</label>
            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  ref={tenDuAnRef}
                  defaultValue={dataUpdate.du_an}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataDuAn().map((item) => (
                    <option key={item.id} value={item.ten_du_an}>
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
                  defaultValue={dataUpdate.so_phong_ngu}
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
                  defaultValue={dataUpdate.so_phong_tam}
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
                  defaultValue={dataUpdate.loai_can_ho}
                  ref={loaiCanHoRef}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataLoaiCanHo().map((item) => (
                    <option key={item.id} value={item.loai_can_ho}>
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
                  defaultValue={dataUpdate.dien_tich}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Diện tích (m²)</label>
              </div>
              <div className="form-floating">
                <select
                  ref={huongBanCongRef}
                  defaultValue={dataUpdate.huong_can_ho}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataHuongCanHo().map((item) => (
                    <option key={item.id} value={item.huong_can_ho}>
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
                  defaultValue={dataUpdate.noi_that}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataNoiThat().map((item) => (
                    <option key={item.id} value={item.loai_noi_that}>
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
                  defaultValue={dataUpdate.gia_ban}
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
                  defaultValue={dataUpdate.gia_thue}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Giá thuê</label>
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                ref={ghiChuRef}
                type="text"
                defaultValue={dataUpdate.ghi_chu}
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
              <label htmlFor="floatingInputGrid">Ghi chú</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModalUpdate(false)}
            >
              Close
            </Button>
            <Button onClick={capNhatCanHo} variant="primary">
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal>
        {/*  */}
        <Modal
          className="modal-lg"
          show={showModalHinhAnh}
          scrollable
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Thêm dự án mới</Modal.Title>
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
              <PreviewImage
                props={showImageUpdate}
                onRemoveImage={removeImageModalUpdate}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModalHinhAnh(false)}
            >
              Close
            </Button>
            <Button variant="primary">Tải ảnh xuống</Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="d-flex flex-wrap gap-4 my-5 mx-2">
        <select
          ref={tenDuAnRef}
          className="form-select w-auto"
          aria-label="Default select example"
        >
          <option value="">Chọn tên dự án</option>
          {dataDuAn().map((item) => (
            <option key={item.id} value={item.ten_du_an}>
              {item.ten_du_an}
            </option>
          ))}
        </select>
        <select
          ref={tenToaNhaRef}
          className="form-select w-auto"
          aria-label="Default select example"
        >
          <option value=""> Chọn tên tòa nhà</option>
          {dataToaNha().map((item, index) => (
            <option key={item.id} value={item.ten_toa_nha}>
              {item.ten_toa_nha}
            </option>
          ))}
        </select>
        <select
          ref={noiThatRef}
          className="form-select w-auto"
          aria-label="Default select example"
        >
          <option value="">Chọn nội thất</option>
          {dataNoiThat().map((item) => (
            <option key={item.id} value={item.loai_noi_that}>
              {item.loai_noi_that}
            </option>
          ))}
        </select>
        <select
          ref={loaiCanHoRef}
          className="form-select w-auto"
          aria-label="Default select example"
        >
          <option value=""> Chọn loại căn hộ</option>
          {dataLoaiCanHo().map((item) => (
            <option key={item.id} value={item.loai_can_selectho}>
              {item.loai_can_ho}
            </option>
          ))}
        </select>
        <select
          ref={huongBanCongRef}
          className="form-select w-auto"
          aria-label="Default select example"
        >
          <option value="">Chọn hướng ban công</option>
          {dataHuongCanHo().map((item) => (
            <option key={item.id} value={item.huong_can_ho}>
              {item.huong_can_ho}
            </option>
          ))}
        </select>
        <input
          ref={soPhongNguRef}
          type="number"
          placeholder="Số phòng ngủ"
          className="form-control w-auto"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        />
        <select
          className="form-select w-auto"
          ref={trucCanHoRef}
          aria-label="Default select example"
        >
          <option value="">Chọn trục căn hộ</option>
          {dataTrucCanHo().map((item) => (
            <option key={item.id} value={item.truc_can}>
              {item.truc_can}
            </option>
          ))}
        </select>
        <select
          ref={locGiaCanHoRef}
          className="form-select w-auto"
          aria-label="Default select example"
        >
          <option value="">Lọc giá</option>
          {locGiaCanHo.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          ref={giaBanTuRef}
          type="number"
          placeholder="Giá bán từ"
          className="form-control w-auto"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        />
        <input
          ref={giaBanDenRef}
          type="number"
          placeholder="Đến giá"
          className="form-control w-auto"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        />
        <input
          ref={giaThueTuRef}
          type="number"
          placeholder="Giá thuê từ"
          className="form-control w-auto"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        />
        <input
          ref={giaThueDenRef}
          type="number"
          placeholder="Đến giá"
          className="form-control w-auto"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        />
        <button className="btn btn-primary" onClick={timKiem}>
          Tìm kiếm
        </button>
        <button className="btn btn-outline-primary" onClick={lamMoi}>
          Làm mới
        </button>
      </div>
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
                <br />- <strong>{item.nguoi_cap_nhat}</strong>
              </td>
              <td className="align-middle">
                {role === "Admin" && (
                  <button
                    type="button"
                    onClick={() => {
                      setDataUpdate(item);
                      setShowModalUpdate(true);
                    }}
                    className="btn btn-danger my-2"
                  >
                    Chi tiết
                  </button>
                )}
                <br />
                <button
                  onClick={() => {
                    if (item.hinh_anh) {
                      let arrayHinhAnh = item.hinh_anh.split(",");
                      setShowImageUpdate(
                        arrayHinhAnh.map(
                          (img) =>
                            `${json_config.url_connect}/can-ho/${item.id}/${img}`
                        )
                      );
                    } else {
                      setShowImageUpdate([]);
                    }
                    setDataUpdate(item);
                    setShowModalHinhAnh(true);
                  }}
                  type="button"
                  className={`btn ${
                    item.hinh_anh ? "btn-primary" : "btn-info"
                  }`}
                >
                  Hình ảnh
                </button>
                <br />
                <button
                  onClick={() => guiYeuCau(item.id)}
                  type="button"
                  className="btn btn-success my-2"
                >
                  Yêu cầu
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
