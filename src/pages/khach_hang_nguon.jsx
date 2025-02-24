import './css/css.css';
import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { dateToText } from "../services/utils";
import Loading from "./components/loading";
import { REQUEST } from "../api/method";
import { useNavigate } from "react-router-dom";
import { authentication } from "./controllers/function";

export default function KhachHangNguon() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();
  const hoTenRef = useRef(null);
  const khachGoiTuRef = useRef(null);
  const soDienThoaiRef = useRef(null);
  const ghiChuRef = useRef(null);
  const ngayPhatSinhRef = useRef(null);

  useEffect(() => {
    (async function getData() {
      try {
        const {
          data: { status, data },
        } = await REQUEST.get("/khach-hang-nguon");
        setLoading(false);
        if (status) {
          setData(data);
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

  async function themKhachHangNguon() {
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
        data: { status, id, response },
      } = await REQUEST.post("/khach-hang-nguon/them-khach-hang", dataPost);
      setLoading(false);
      toast.success(response);
      if (status) {
        setShowModal(false);
        setData((pre) => [...pre, { id, ...dataPost }]);
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

  async function capNhatKhachHangNguon() {
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
        data: { status, response },
      } = await REQUEST.post("/khach-hang-nguon/cap-nhat-khach-hang", dataPost);
      setLoading(false);
      toast.success(response);
      if (status) {
        setShowModalUpdate(false);
        setData((pre) =>
          pre.map((item) => (item.id === dataPost.id ? dataPost : item))
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

  function openModalUpdate(item) {
    setDataUpdate(item);
    setShowModalUpdate(true);
  }

  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
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
            <Button variant="primary" onClick={themKhachHangNguon}>
              Thêm mới
            </Button>
          </Modal.Footer>
        </Modal>
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
            <Button variant="primary" onClick={capNhatKhachHangNguon}>
              Cập nhật
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <table className="table table-bordered table-hover">
        <thead>
          <tr className="table-primary">
            <th scope="col">STT</th>
            <th scope="col">Họ tên</th>
            <th scope="col">Số điện thoại</th>
            <th scope="col">Khách hàng từ</th>
            <th scope="col">Ngày phát sinh</th>
            <th scope="col">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const styles = {
              row: { cursor: "pointer" }
            };
            return (
              <tr key={item.id} style={styles.row} onClick={() => openModalUpdate(item)}>
                <td className="align-middle">{item.id}</td>
                <td className="align-middle">{item.ten_khach_hang}</td>
                <td className="align-middle"> {item.so_dien_thoai}</td>
                <td className="align-middle">{item.khach_goi_tu}</td>
                <td className="align-middle">
                  {dateToText(item.ngay_phat_sinh)}
                </td>
                <td className="w-25 align-middle">{item.ghi_chu}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}
