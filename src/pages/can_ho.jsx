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
  dataTrucCanHo,
  getRoleNguoiDung,
  loaiGiaoDichKhachHang,
  trangThaiDuAn,
} from "../services/utils";
import PreviewImage from "./components/preview_image";
import { toast, ToastContainer } from "react-toastify";
import "./css/css.css";
import { dataCanHoDefault } from "../data/default_data";

export default function CanHo() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(dataCanHoDefault);
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
  const trangThaiDuAnRef = useRef(null);
  const trucCanHoRef = useRef(null);

  async function getData() {
    const { data } = await axios.get(`${json_config.url_connect}/can-ho`, {
      headers: {
        Authorization: getRoleNguoiDung(),
        "Content-Type": "application/json",
      },
    });
    setData(data);
  }

  async function capNhatAnhCanHo(event) {
    try {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      const formData = new FormData();
      formData.append("ma_can_ho", dataUpdate.ma_can_ho);

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
                `${json_config.url_connect}/${dataUpdate.ma_can_ho}/${img}`
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

  const removeImageModalAdd = async (index) => {
    const dataTransfer = new DataTransfer();
    const newImages = showImage.filter((_, i) => i !== index);

    await Promise.all(
      newImages.map(async (src, index) => {
        const response = await fetch(src);
        const blob = await response.blob();
        const file = new File([blob], `image${index}.png`, {
          type: "image/png",
        });
        dataTransfer.items.add(file);
      })
    );

    hinhAnhRef.current.files = dataTransfer.files;
    setShowImage(newImages);
  };

  const removeImageModalUpdate = async (index) => {
    const listImgPath = showImageUpdate[index].split("/");
    const imgPath = listImgPath[listImgPath.length - 1];

    try {
      const response = await axios.post(
        `${json_config.url_connect}/can-ho/xoa-anh-can-ho`,
        { ma_can_ho: dataUpdate.ma_can_ho, filename: imgPath }
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
                `${json_config.url_connect}/${dataUpdate.ma_can_ho}/${img}`
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
        tenToaNha: tenToaNhaRef.current.value,
        maCanHo: maCanHoRef.current.value,
        hoTenChuCanHo: hoTenChuCanHoRef.current.value,
        soDienThoai: soDienThoaiRef.current.value,
        loaiGiaoDich: loaiGiaoDichRef.current.value,
        tenDuAn: tenDuAnRef.current.value,
        soPhongNgu: soPhongNguRef.current.value,
        soPhongTam: soPhongTamRef.current.value,
        loaiCanHo: loaiCanHoRef.current.value,
        dienTich: dienTichRef.current.value,
        huongBanCong: huongBanCongRef.current.value,
        noiThat: noiThatRef.current.value,
        giaBan: giaBanRef.current.value,
        giaThue: giaThueRef.current.value,
        ghiChu: ghiChuRef.current.value,
        hinhAnh: hinhAnhRef.current.files,
        trangThaiDuAn: trangThaiDuAnRef.current.value,
        trucCanHo: trucCanHoRef.current.value,
      };

      const isInvalidInput = (value, allowNegative = false) =>
        value === "" || (!allowNegative && Number(value) < 0);

      if (
        isInvalidInput(data.hoTenChuCanHo) ||
        isInvalidInput(data.soDienThoai) ||
        isInvalidInput(data.maCanHo) ||
        isInvalidInput(data.tenDuAn) ||
        isInvalidInput(data.soPhongNgu) ||
        isInvalidInput(data.soPhongTam) ||
        isInvalidInput(data.dienTich) ||
        isInvalidInput(data.giaBan) ||
        isInvalidInput(data.giaThue) ||
        isInvalidInput(data.ghiChu)
      ) {
        toast.error("Kiểm tra lại dữ liệu");
        return;
      }

      const formData = new FormData();
      formData.append("ten_khach_hang", data.hoTenChuCanHo);
      formData.append("so_dien_thoai", data.soDienThoai);
      formData.append("loai_giao_dich", data.loaiGiaoDich);
      formData.append("ngay_ki_hop_dong", new Date().toISOString());
      formData.append("ten_du_an", data.tenDuAn);
      formData.append("dien_tich", data.dienTich);
      formData.append("so_phong_ngu", data.soPhongNgu);
      formData.append("so_phong_tam", data.soPhongTam);
      formData.append("huong_can_ho", data.huongBanCong);
      formData.append("loai_can_ho", data.loaiCanHo);
      formData.append("noi_that", data.noiThat);
      formData.append("mo_ta", data.ghiChu);
      formData.append("nguoi_cap_nhat", 1);
      formData.append("gia_ban", data.giaBan);
      formData.append("gia_thue", data.giaThue);
      formData.append("trang_thai", data.trangThaiDuAn);
      formData.append("ma_can_ho", data.maCanHo);
      formData.append("ten_toa_nha", data.tenToaNha);
      formData.append("truc_can_ho", data.trucCanHo);
      Array.from(data.hinhAnh).forEach((file) => {
        formData.append("hinh_anh", file);
      });

      const response = await axios.post(
        `${json_config.url_connect}/can-ho/them-can-ho`,
        formData
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
                  files.forEach((file) => {
                    const fileURL = URL.createObjectURL(file);
                    setShowImage((pre) => [...pre, fileURL]);
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
                  defaultValue={dataUpdate.ma_can_ho.substring(
                    0,
                    dataUpdate.ma_can_ho.indexOf("-")
                  )}
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
                  defaultValue={dataUpdate.ma_can_ho}
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
                  defaultValue={dataUpdate.ten_khach_hang}
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
                  defaultValue={dataUpdate.so_dien_thoai}
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
              onClick={() => setShowModalUpdate(false)}
            >
              Close
            </Button>
            <Button variant="primary">Xác nhận</Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/*  */}
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
          {data.map((item) => (
            <tr key={item.id}>
              <td className="align-middle">{item.id}</td>
              <td className="align-middle">
                {item.ten_toa_nha}-{item.ma_can_ho ?? "*"}
                {item.truc_can_ho}
              </td>
              <td className="align-middle">{item.ten_khach_hang ?? "*"}</td>
              <td className="align-middle">{item.so_dien_thoai ?? "*"}</td>
              <td className="align-middle">{item.gia_ban}</td>
              <td className="align-middle">{item.gia_thue}</td>
              <td className="w-25 text-start align-middle">
                - {item.du_an} - {item.dien_tich}m² - {item.so_phong_ngu}PN
                {item.so_phong_tam}WC - {item.huong_can_ho}
                <br />- {item.loai_can_ho}
                <br />- {item.noi_that}
                <br />- {item.ghi_chu}
                <br />- {item.nguoi_cap_nhat}
              </td>
              <td className="align-middle">
                <button
                  type="button"
                  onClick={() => {
                    let arrayHinhAnh = item.hinh_anh.split(",");
                    setShowImageUpdate(
                      arrayHinhAnh.map(
                        (img) =>
                          `${json_config.url_connect}/${item.ma_can_ho}/${img}`
                      )
                    );
                    setDataUpdate(item);
                    setShowModalUpdate(true);
                  }}
                  className="btn btn-primary"
                >
                  Chi tiết
                </button>
                <div />
                <br />
                <button type="button" className="btn btn-primary">
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
