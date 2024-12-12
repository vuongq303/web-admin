import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import json_config from "../config.json";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { dateToText, loaiGiaoDichKhachHang } from "../services/utils";

export default function KhachHang() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});

  const maCanHoRef = useRef(null);
  const hoTenRef = useRef(null);
  const ngayKiHopDongRef = useRef(null);
  const soDienThoaiRef = useRef(null);
  const ghiChuRef = useRef(null);
  const loaiGiaoDichRef = useRef(null);

  async function getData() {
    try {
      const { data } = await axios.get(json_config.url_connect + "/khach-hang");
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
      const maCanHo = maCanHoRef.current.value;
      const hoTen = hoTenRef.current.value;
      const ngayKiHopDong = ngayKiHopDongRef.current.value;
      const soDienThoai = soDienThoaiRef.current.value;
      const ghiChu = ghiChuRef.current.value;
      const loaiGiaoDich = loaiGiaoDichRef.current.value;

      if (
        maCanHo === "" ||
        hoTen === "" ||
        ngayKiHopDong === "" ||
        soDienThoai === "" ||
        ghiChu === "" ||
        loaiGiaoDich === ""
      ) {
        toast.error("Không được để trống thông tin");
        return;
      }

      const dataKhachHang = {
        ten_khach_hang: hoTen,
        so_dien_thoai: soDienThoai,
        ma_can_ho: maCanHo,
        loai_giao_dich: loaiGiaoDich,
        ngay_ki_hop_dong: ngayKiHopDong,
        ghi_chu: ghiChu,
      };

      const {
        status,
        data: { response, type },
      } = await axios.post(
        `${json_config.url_connect}/khach-hang/them-khach-hang`,
        dataKhachHang
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
      const maCanHo = maCanHoRef.current.value;
      const hoTen = hoTenRef.current.value;
      const ngayKiHopDong = ngayKiHopDongRef.current.value;
      const soDienThoai = soDienThoaiRef.current.value;
      const ghiChu = ghiChuRef.current.value;
      const loaiGiaoDich = loaiGiaoDichRef.current.value;

      if (
        hoTen === "" ||
        maCanHo === "" ||
        ngayKiHopDong === "" ||
        soDienThoai === "" ||
        ghiChu === ""
      ) {
        toast.error("Không được để trống thông tin");
        return;
      }

      const dataKhachHang = {
        ten_khach_hang: hoTen,
        so_dien_thoai: soDienThoai,
        ma_can_ho: maCanHo,
        loai_giao_dich: loaiGiaoDich,
        ngay_ki_hop_dong: ngayKiHopDong,
        ghi_chu: ghiChu,
        id: dataUpdate.id,
      };

      const {
        status,
        data: { response, type },
      } = await axios.post(
        `${json_config.url_connect}/khach-hang/cap-nhat-khach-hang`,
        dataKhachHang
      );
      if (status === 200) {
        toast.success(response);
        if (type) {
          setShowModalUpdate(false);
          await getData();
          return;
        }
      }
      toast.error("Cập nhật khách hàng mới thất bại");
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
            <Modal.Title>Thêm khách hàng mới</Modal.Title>
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
                  ref={maCanHoRef}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Mã căn hộ</label>
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
                <label htmlFor="floatingInputGrid">Họ tên</label>
              </div>
              <select
                className="form-select"
                aria-label="Default select example"
                ref={loaiGiaoDichRef}
              >
                {loaiGiaoDichKhachHang.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
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
                  ref={ngayKiHopDongRef}
                  type="date"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Ngày kí hợp đồng</label>
              </div>
            </div>

            <div>
              <label>Ghi chú</label>
              <div className="input-group mb-3">
                <textarea
                  ref={ghiChuRef}
                  type="text"
                  rows={5}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
              </div>
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
                  ref={maCanHoRef}
                  defaultValue={dataUpdate.ma_can_ho}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Mã căn hộ</label>
              </div>
            </div>

            <div className="input-group mb-3">
              <div className="form-floating">
                <input
                  ref={hoTenRef}
                  type="text"
                  defaultValue={dataUpdate.ten_khach_hang}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Họ tên</label>
              </div>
              <select
                className="form-select"
                aria-label="Default select example"
                ref={loaiGiaoDichRef}
              >
                {loaiGiaoDichKhachHang.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
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
                  ref={ngayKiHopDongRef}
                  type="date"
                  defaultValue={
                    dataUpdate.ngay_ki_hop_dong &&
                    dateToText(dataUpdate.ngay_ki_hop_dong)
                  }
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Ngày kí hợp đồng</label>
              </div>
            </div>

            <div>
              <label>Ghi chú</label>
              <div className="input-group mb-3">
                <textarea
                  ref={ghiChuRef}
                  defaultValue={dataUpdate.ghi_chu}
                  type="text"
                  rows={5}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
              </div>
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
            <th scope="col">Mã căn hộ</th>
            <th scope="col">Họ tên</th>
            <th scope="col">Số điện thoại</th>
            <th scope="col">Loại giao dịch</th>
            <th scope="col">Ngày kí hợp đồng</th>
            <th scope="col">Ghi chú</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.ma_can_ho}</td>
              <td>{item.ten_khach_hang}</td>
              <td>{item.so_dien_thoai}</td>
              <td>{item.loai_giao_dich}</td>
              <td>{dateToText(item.ngay_ki_hop_dong)}</td>
              <td>{item.ghi_chu.substring(0, 20)}...</td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
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
