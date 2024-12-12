import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import json_config from "../config.json";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import {
  dateToText,
  gioiTinhNguoiDung,
  phanQuyenNguoiDung,
  trangThaiLamViec,
} from "../services/utils";

export default function NguoiDung() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [showImageUpdate, setShowImageUpdate] = useState("");
  const [showImage, setShowImage] = useState("");

  const taiKhoanRef = useRef(null);
  const matKhauRef = useRef(null);
  const hoTenRef = useRef(null);
  const ngayBatDauRef = useRef(null);
  const soDienThoaiRef = useRef(null);
  const ngaySinhRef = useRef(null);
  const emailRef = useRef(null);
  const gioiTinhRef = useRef(null);
  const viTriRef = useRef(null);
  const trangThaiRef = useRef(null);
  const hinhAnhRef = useRef(null);

  async function getData() {
    try {
      const { data } = await axios.get(json_config.url_connect + "/nguoi-dung");
      setData(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function themNguoiDung() {
    try {
      const taiKhoan = taiKhoanRef.current.value;
      const matKhau = matKhauRef.current.value;
      const hoTen = hoTenRef.current.value;
      const ngayBatDau = ngayBatDauRef.current.value;
      const soDienThoai = soDienThoaiRef.current.value;
      const ngaySinh = ngaySinhRef.current.value;
      const email = emailRef.current.value;
      const viTri = viTriRef.current.value;
      const gioiTinh = gioiTinhRef.current.value;
      const trangThai = trangThaiRef.current.value;
      const hinhAnh = hinhAnhRef.current.files[0];

      const formData = new FormData();
      formData.append("tai_khoan", taiKhoan);
      formData.append("mat_khau", matKhau);
      formData.append("ho_ten", hoTen);
      formData.append("ngay_bat_dau", ngayBatDau);
      formData.append("so_dien_thoai", soDienThoai);
      formData.append("ngay_sinh", ngaySinh);
      formData.append("email", email);
      formData.append("vi_tri", viTri);
      formData.append("gioi_tinh", gioiTinh);
      formData.append("trang_thai", trangThai);
      formData.append("hinh_anh", hinhAnh);

      if (
        taiKhoan === "" ||
        matKhau === "" ||
        hoTen === "" ||
        ngayBatDau === "" ||
        soDienThoai === "" ||
        ngaySinh === "" ||
        email === "" ||
        !hinhAnh
      ) {
        toast.error("Không được để trống thông tin");
        return;
      }

      const {
        status,
        data: { response, type },
      } = await axios.post(
        `${json_config.url_connect}/nguoi-dung/them-nguoi-dung`,
        formData
      );

      if (status === 200) {
        toast.success(response);
        if (type) {
          setShowModal(false);
          await getData();
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function capNhatNguoiDung() {
    try {
      const taiKhoan = taiKhoanRef.current.value;
      const hoTen = hoTenRef.current.value;
      const ngayBatDau = ngayBatDauRef.current.value;
      const soDienThoai = soDienThoaiRef.current.value;
      const ngaySinh = ngaySinhRef.current.value;
      const email = emailRef.current.value;
      const viTri = viTriRef.current.value;
      const gioiTinh = gioiTinhRef.current.value;
      const trangThai = trangThaiRef.current.value;
      const hinhAnh = hinhAnhRef.current.files[0];
      const id = dataUpdate.id;

      if (
        hoTen === "" ||
        ngayBatDau === "" ||
        soDienThoai === "" ||
        ngaySinh === "" ||
        email === ""
      ) {
        toast.error("Không được để trống thông tin");
        return;
      }

      const formData = new FormData();
      formData.append("id", id);
      formData.append("tai_khoan", taiKhoan);
      formData.append("ho_ten", hoTen);
      formData.append("ngay_bat_dau", ngayBatDau);
      formData.append("so_dien_thoai", soDienThoai);
      formData.append("ngay_sinh", ngaySinh);
      formData.append("email", email);
      formData.append("vi_tri", viTri);
      formData.append("gioi_tinh", gioiTinh);
      formData.append("trang_thai", trangThai);
      formData.append("hinh_anh", hinhAnh);

      const {
        status,
        data: { response, type },
      } = await axios.post(
        `${json_config.url_connect}/nguoi-dung/cap-nhat-nguoi-dung`,
        formData
      );
      if (status === 200) {
        toast.success(response);
        if (type) {
          setShowModalUpdate(false);
          await getData();
          return;
        }
      }
      toast.error("Cập nhật người dùng mới thất bại");
    } catch (error) {
      console.log(error);
    }
  }

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
          onClick={() => setShowModal(true)}
        >
          Thêm mới
        </button>
        {/*  */}
        <Modal show={showModal} scrollable backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>Thêm người dùng mới</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <div className="input-group mb-3">
              <div className="form-floating">
                <input
                  ref={taiKhoanRef}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Tài khoản</label>
              </div>
            </div>

            <div className="input-group mb-3">
              <div className="form-floating">
                <input
                  ref={matKhauRef}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Mật khẩu</label>
              </div>
            </div>

            <div className="input-group mb-3">
              <div className="form-floating">
                <input
                  ref={hoTenRef}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Họ và tên</label>
              </div>
              <div className="form-floating">
                <input
                  ref={ngayBatDauRef}
                  type="date"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Ngày bắt đầu</label>
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
                <input
                  ref={ngaySinhRef}
                  type="date"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Ngày sinh</label>
              </div>
            </div>

            <div className="input-group mb-3">
              <div className="form-floating">
                <input
                  ref={emailRef}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Email</label>
              </div>
              <div className="form-floating">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  ref={gioiTinhRef}
                >
                  {gioiTinhNguoiDung.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Giới tính</label>
              </div>
            </div>

            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  ref={viTriRef}
                >
                  {phanQuyenNguoiDung.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Vị trí</label>
              </div>
              <div className="form-floating">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  ref={trangThaiRef}
                >
                  {trangThaiLamViec.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Trạng thái</label>
              </div>
            </div>

            <div className="input-group mb-3">
              <div className="form-floating">
                <input
                  aria-label="123"
                  className="form-control"
                  type="file"
                  id="fileInput"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setShowImage(e.target.result);
                    };
                    reader.readAsDataURL(file);
                  }}
                  ref={hinhAnhRef}
                />
                <label htmlFor="fileInput">Thông tin ảnh</label>
              </div>
              <img width="50%" height={150} src={showImage} alt="Img" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={themNguoiDung}>
              Thêm mới
            </Button>
          </Modal.Footer>
        </Modal>
        {/*  */}
        <Modal
          show={showModalUpdate}
          scrollable
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Cập nhật người dùng</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModalUpdate(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <div className="input-group mb-3">
              <div className="form-floating">
                <input
                  disabled
                  ref={taiKhoanRef}
                  defaultValue={dataUpdate.tai_khoan}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Tài khoản</label>
              </div>
            </div>

            <div className="input-group mb-3">
              <div className="form-floating">
                <input
                  ref={hoTenRef}
                  defaultValue={dataUpdate.ho_ten}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Họ và tên</label>
              </div>

              <div className="form-floating">
                <input
                  ref={ngayBatDauRef}
                  defaultValue={
                    dataUpdate.ngay_bat_dau &&
                    dateToText(dataUpdate.ngay_bat_dau)
                  }
                  type="date"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Ngày bắt đầu</label>
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
                <input
                  ref={ngaySinhRef}
                  type="date"
                  defaultValue={
                    dataUpdate.ngay_sinh && dateToText(dataUpdate.ngay_sinh)
                  }
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Ngày sinh</label>
              </div>
            </div>
            <div className="input-group mb-3">
              <div className="form-floating">
                <input
                  ref={emailRef}
                  defaultValue={dataUpdate.email}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Email</label>
              </div>
              <div className="form-floating">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  defaultValue={dataUpdate.gioi_tinh}
                  ref={gioiTinhRef}
                >
                  {gioiTinhNguoiDung.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Giới tính</label>
              </div>
            </div>

            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  ref={viTriRef}
                  defaultValue={dataUpdate.phan_quyen}
                >
                  {phanQuyenNguoiDung.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Vị trí</label>
              </div>
              <div className="form-floating">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  ref={trangThaiRef}
                  defaultValue={dataUpdate.trang_thai}
                >
                  {trangThaiLamViec.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Trạng thái</label>
              </div>
            </div>

            <div className="input-group mb-3">
              <div className="form-floating">
                <input
                  aria-label="123"
                  className="form-control"
                  type="file"
                  id="fileInput"
                  ref={hinhAnhRef}
                  onChange={(event) => {
                    const file = event.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setShowImageUpdate(e.target.result);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                <label htmlFor="fileInput">Thông tin ảnh</label>
              </div>
              <img width="50%" height={150} src={showImageUpdate} alt="Img" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModalUpdate(false)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={capNhatNguoiDung}>
              Cập nhật
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/*  */}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">STT</th>
            <th scope="col">Họ tên</th>
            <th scope="col">Ngày bắt đầu</th>
            <th scope="col">Số điện thoại</th>
            <th scope="col">Email</th>
            <th scope="col">Ngày sinh</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Vị trí</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.ho_ten}</td>
              <td>{dateToText(item.ngay_bat_dau)}</td>
              <td>{item.so_dien_thoai}</td>
              <td>{item.email}</td>
              <td>{dateToText(item.ngay_sinh)}</td>
              <td>{item.trang_thai}</td>
              <td>{item.phan_quyen}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowImageUpdate(item.hinh_anh);
                    setDataUpdate(item);
                    setShowModalUpdate(true);
                  }}
                >
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
