import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { dateToText, getRoleNguoiDung } from "../services/utils";
import Loading from "./components/loading";
import { ketNoi } from "../data/module";

export default function KhachHangNguon() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [loading, setLoading] = useState(true);

  const hoTenRef = useRef(null);
  const khachGoiTuRef = useRef(null);
  const soDienThoaiRef = useRef(null);
  const ghiChuRef = useRef(null);
  const ngayPhatSinhRef = useRef(null);

  useEffect(() => {
    (async function getData() {
      try {
        const { data } = await axios.get(`${ketNoi.url}/khach-hang-nguon`, {
          headers: {
            Authorization: getRoleNguoiDung(),
            "Content-Type": "application/json",
          },
        });
        setLoading(false);
        setData(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  async function themNguoiDung() {
    try {
      const dataPost = {
        ten_khach_hang: hoTenRef.current.value,
        khach_goi_tu: khachGoiTuRef.current.value,
        so_dien_thoai: soDienThoaiRef.current.value,
        ghi_chu: ghiChuRef.current.value,
        ngay_phat_sinh: ngayPhatSinhRef.current.value,
      };

      if (
        dataPost.ten_khach_hang === "" ||
        dataPost.khach_goi_tu === "" ||
        dataPost.so_dien_thoai === "" ||
        dataPost.ghi_chu === "" ||
        dataPost.ngay_phat_sinh === ""
      ) {
        toast.error("Không được để trống thông tin");
        return;
      }
      setLoading(true);
      const {
        status,
        data: { response, type, id },
      } = await axios.post(
        `${ketNoi.url}/khach-hang-nguon/them-khach-hang`,
        dataPost
      );

      if (status === 200) {
        toast.success(response);
        if (type) {
          setLoading(false);
          setShowModal(false);
          setData((pre) => [...pre, { id, ...dataPost }]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function capNhatNguoiDung() {
    try {
      const dataPost = {
        ten_khach_hang: hoTenRef.current.value,
        khach_goi_tu: khachGoiTuRef.current.value,
        so_dien_thoai: soDienThoaiRef.current.value,
        ghi_chu: ghiChuRef.current.value,
        ngay_phat_sinh: ngayPhatSinhRef.current.value,
        id: dataUpdate.id,
      };

      if (
        dataPost.ten_khach_hang === "" ||
        dataPost.khach_goi_tu === "" ||
        dataPost.so_dien_thoai === "" ||
        dataPost.ghi_chu === "" ||
        dataPost.ngay_phat_sinh === ""
      ) {
        toast.error("Không được để trống thông tin");
        return;
      }
      setLoading(true);
      const {
        status,
        data: { response, type },
      } = await axios.post(
        `${ketNoi.url}/khach-hang-nguon/cap-nhat-khach-hang`,
        dataPost
      );

      if (status === 200) {
        toast.success(response);
        if (type) {
          setLoading(false);
          setShowModalUpdate(false);
          setData((pre) =>
            pre.map((item) => (item.id === dataPost.id ? dataPost : item))
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  function openModalUpdate(item) {
    setDataUpdate(item);
    setShowModalUpdate(true);
  }
  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={200}
        hideProgressBar={false}
      />
      <Loading loading={loading} />
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
                  ref={hoTenRef}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Họ tên</label>
              </div>
              <div className="form-floating">
                <input
                  ref={ngayPhatSinhRef}
                  type="date"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Ngày phát sinh</label>
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
                  ref={khachGoiTuRef}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Khách hàng từ</label>
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
                  ref={hoTenRef}
                  type="text"
                  defaultValue={dataUpdate.ten_khach_hang}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Họ tên</label>
              </div>
              <div className="form-floating">
                <input
                  ref={ngayPhatSinhRef}
                  type="date"
                  defaultValue={
                    dataUpdate.ngay_phat_sinh &&
                    dateToText(dataUpdate.ngay_phat_sinh)
                  }
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Ngày phát sinh</label>
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
                  ref={khachGoiTuRef}
                  type="text"
                  defaultValue={dataUpdate.khach_goi_tu}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Khách hàng từ</label>
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
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">STT</th>
            <th scope="col">Họ tên</th>
            <th scope="col">Số điện thoại</th>
            <th scope="col">Khách hàng từ</th>
            <th scope="col">Ngày phát sinh</th>
            <th scope="col">Ghi chú</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="align-middle">{item.id}</td>
              <td className="align-middle">{item.ten_khach_hang}</td>
              <td className="align-middle"> {item.so_dien_thoai}</td>
              <td className="align-middle">{item.khach_goi_tu}</td>
              <td className="align-middle">
                {dateToText(item.ngay_phat_sinh)}
              </td>
              <td className="w-25 align-middle">{item.ghi_chu}</td>
              <td className="align-middle">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => openModalUpdate(item)}
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
