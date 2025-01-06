import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import Loading from "./components/loading";
import {
  dateToText,
  loaiGiaoDichKhachHang,
  phiMoiGioi,
} from "../services/utils";
import { ketNoi } from "../data/module";
import { GET, GET_PARAMS } from "../api/method";

export default function KhachHang() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [loading, setLoading] = useState(false);
  const hoTenRef = useRef(null);
  const ngayKiHopDongRef = useRef(null);
  const hoTenChuNhaRef = useRef(null);
  const maCanHoRef = useRef(null);
  const soDienThoaiChuNhaRef = useRef(null);
  const soDienThoaiRef = useRef(null);
  const ghiChuRef = useRef(null);
  const loaiGiaoDichRef = useRef(null);
  const phiMoiGioiRef = useRef(null);
  const ngaySinhRef = useRef(null);
  const phiMoiGioiTimKiemRef = useRef(null);
  const ngaySinhBatDauTimKiemRef = useRef(null);
  const ngaySinhKetThucTimKiemRef = useRef(null);

  async function getData() {
    setLoading(true);
    const data = await GET("/khach-hang");
    setLoading(false);
    setData(data);
  }

  useEffect(() => {
    getData();
  }, []);

  async function timKiemKhachHang() {
    const dataPost = {
      phi_moi_gioi: phiMoiGioiTimKiemRef.current.value,
      ngay_bat_dau: ngaySinhBatDauTimKiemRef.current.value,
      ngay_ket_thuc: ngaySinhKetThucTimKiemRef.current.value,
    };

    if (
      dataPost.phi_moi_gioi === "" &&
      dataPost.ngay_bat_dau === "" &&
      dataPost.ngay_ket_thuc === ""
    ) {
      return;
    }

    setLoading(true);
    const result = await GET_PARAMS("/khach-hang/tim-kiem", dataPost);
    setLoading(false);
    setData(result);
    try {
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function lamMoi() {
    phiMoiGioiTimKiemRef.current.value = "";
    ngaySinhBatDauTimKiemRef.current.value = "";
    ngaySinhKetThucTimKiemRef.current.value = "";
    await getData();
  }

  async function themKhachHang() {
    try {
      const dataPost = {
        ten_khach_hang: hoTenRef.current.value,
        ngay_ki_hop_dong: ngayKiHopDongRef.current.value,
        so_dien_thoai: soDienThoaiRef.current.value,
        ghi_chu: ghiChuRef.current.value,
        loai_giao_dich: loaiGiaoDichRef.current.value,
        ma_can_ho: maCanHoRef.current.value,
        ho_ten_chu_nha: hoTenChuNhaRef.current.value,
        so_dien_thoai_chu_nha: soDienThoaiChuNhaRef.current.value,
        ngay_sinh: ngaySinhRef.current.value,
        phi_moi_gioi: phiMoiGioiRef.current.value,
      };

      if (
        dataPost.ho_ten === "" ||
        dataPost.ngay_ki_hop_dong === "" ||
        dataPost.so_dien_thoai === "" ||
        dataPost.ghi_chu === "" ||
        dataPost.loai_giao_dich === "" ||
        dataPost.ma_can_ho === "" ||
        dataPost.ho_ten_chu_nha === "" ||
        dataPost.so_dien_thoai_chu_nha === "" ||
        dataPost.ngay_sinh === ""
      ) {
        toast.error("Không được để trống thông tin");
        return;
      }

      setLoading(true);
      const {
        status,
        data: { response, type, id },
      } = await axios.post(
        `${ketNoi.url}/khach-hang/them-khach-hang`,
        dataPost
      );

      if (status === 200) {
        toast.success(response);
        if (type) {
          setLoading(false);
          setShowModal(false);
          setData((pre) => [...pre, { id, ...dataPost }]);
          return;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function capNhatKhachHang() {
    try {
      const dataPost = {
        ten_khach_hang: hoTenRef.current.value,
        ngay_ki_hop_dong: ngayKiHopDongRef.current.value,
        so_dien_thoai: soDienThoaiRef.current.value,
        ghi_chu: ghiChuRef.current.value,
        loai_giao_dich: loaiGiaoDichRef.current.value,
        ma_can_ho: maCanHoRef.current.value,
        ho_ten_chu_nha: hoTenChuNhaRef.current.value,
        so_dien_thoai_chu_nha: soDienThoaiChuNhaRef.current.value,
        ngay_sinh: ngaySinhRef.current.value,
        phi_moi_gioi: phiMoiGioiRef.current.value,
        id: dataUpdate.id,
      };

      if (
        dataPost.ho_ten === "" ||
        dataPost.ngay_ki_hop_dong === "" ||
        dataPost.so_dien_thoai === "" ||
        dataPost.ghi_chu === "" ||
        dataPost.loai_giao_dich === "" ||
        dataPost.ma_can_ho === "" ||
        dataPost.ho_ten_chu_nha === "" ||
        dataPost.so_dien_thoai_chu_nha === "" ||
        dataPost.ngay_sinh === ""
      ) {
        toast.error("Không được để trống thông tin");
        return;
      }

      setLoading(true);
      const {
        status,
        data: { response, type },
      } = await axios.post(
        `${ketNoi.url}/khach-hang/cap-nhat-khach-hang`,
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
          return;
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
        <Modal
          show={showModal}
          size="lg"
          scrollable
          backdrop="static"
          keyboard={false}
        >
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
              <div className="form-floating">
                <input
                  ref={hoTenChuNhaRef}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Họ tên chủ nhà</label>
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
                  ref={soDienThoaiChuNhaRef}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Số điện thoại chủ nhà</label>
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
              <div className="form-floating">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  ref={phiMoiGioiRef}
                >
                  {phiMoiGioi.map((item, index) => (
                    <option key={index} value={index}>
                      {item}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Phí môi giới</label>
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
                <label htmlFor="floatingInputGrid">Họ tên khách hàng</label>
              </div>
              <div className="form-floating">
                <input
                  ref={soDienThoaiRef}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">
                  Số điện thoại khách hàng
                </label>
              </div>
              <div className="form-floating">
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
                <label htmlFor="floatingInputGrid">Loại giao dịch</label>
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
            <Button variant="primary" onClick={themKhachHang}>
              Thêm mới
            </Button>
          </Modal.Footer>
        </Modal>
        {/*  */}
        <Modal
          show={showModalUpdate}
          scrollable
          size="lg"
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
                  type="text"
                  defaultValue={dataUpdate.ma_can_ho}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Mã căn hộ</label>
              </div>
              <div className="form-floating">
                <input
                  ref={hoTenChuNhaRef}
                  type="text"
                  defaultValue={dataUpdate.ho_ten_chu_nha}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Họ tên chủ nhà</label>
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
                  ref={soDienThoaiChuNhaRef}
                  type="text"
                  defaultValue={dataUpdate.so_dien_thoai_chu_nha}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Số điện thoại chủ nhà</label>
              </div>
              <div className="form-floating">
                <input
                  ref={ngayKiHopDongRef}
                  defaultValue={
                    dataUpdate.ngay_ki_hop_dong &&
                    dateToText(dataUpdate.ngay_ki_hop_dong)
                  }
                  type="date"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Ngày kí hợp đồng</label>
              </div>
              <div className="form-floating">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  defaultValue={dataUpdate.phi_moi_gioi}
                  ref={phiMoiGioiRef}
                >
                  {phiMoiGioi.map((item, index) => (
                    <option key={index} value={index}>
                      {item}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Phí môi giới</label>
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
                <label htmlFor="floatingInputGrid">Họ tên khách hàng</label>
              </div>
              <div className="form-floating">
                <input
                  ref={soDienThoaiRef}
                  type="text"
                  defaultValue={dataUpdate.so_dien_thoai}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">
                  Số điện thoại khách hàng
                </label>
              </div>
              <div className="form-floating">
                <select
                  className="form-select"
                  defaultValue={dataUpdate.loai_giao_dich}
                  aria-label="Default select example"
                  ref={loaiGiaoDichRef}
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
            <Button variant="primary" onClick={capNhatKhachHang}>
              Cập nhật
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="d-flex flex-wrap gap-4 my-5 mx-2">
        <select
          className="form-select w-auto"
          ref={phiMoiGioiTimKiemRef}
          aria-label="Default select example"
        >
          <option value="">Lọc phí môi giới</option>
          {phiMoiGioi.map((item, index) => (
            <option key={index} value={index}>
              {item}
            </option>
          ))}
        </select>
        <div className="d-flex align-items-center">
          <div>Ngày sinh bắt đầu</div>
          <input
            type="date"
            ref={ngaySinhBatDauTimKiemRef}
            className="form-control w-auto mx-1"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
          />
        </div>
        <div className="d-flex align-items-center">
          <div>Ngày sinh kết thúc</div>
          <input
            ref={ngaySinhKetThucTimKiemRef}
            type="date"
            className="form-control w-auto mx-1"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
          />
        </div>
        <div>
          <button onClick={timKiemKhachHang} className="btn btn-primary">
            Tìm kiếm
          </button>
          <button onClick={lamMoi} className="btn btn-outline-primary mx-2">
            Làm mới
          </button>
        </div>
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr className="table-primary">
            <th scope="col">STT</th>
            <th scope="col">Mã căn hộ</th>
            <th scope="col">Họ tên khách hàng</th>
            <th scope="col">Số điện thoại khách hàng</th>
            <th scope="col">Loại giao dịch</th>
            <th scope="col">Ngày kí hợp đồng</th>
            <th scope="col">Họ tên chủ nhà</th>
            <th scope="col">Số điện thoại chủ nhà</th>
            <th scope="col">Ngày sinh</th>
            <th scope="col">Phí môi giới</th>
            <th scope="col">Ghi chú</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const styles = {
              w_10: { width: "10%" },
              w_15: { width: "15%" },
              w_5: { width: "5%" },
            };
            return (
              <tr key={index}>
                <td className="align-middle">{index + 1}</td>
                <td className="align-middle" style={styles.w_5}>
                  {item.ma_can_ho}
                </td>
                <td className="align-middle">{item.ten_khach_hang}</td>
                <td className="align-middle" style={styles.w_10}>
                  {item.so_dien_thoai}
                </td>
                <td className="align-middle">{item.loai_giao_dich}</td>
                <td className="align-middle">
                  {item.ngay_ki_hop_dong && dateToText(item.ngay_ki_hop_dong)}
                </td>
                <td className="align-middle">{item.ho_ten_chu_nha}</td>
                <td className="align-middle" style={styles.w_10}>
                  {item.so_dien_thoai_chu_nha}
                </td>
                <td className="align-middle" style={styles.w_10}>
                  {item.ngay_sinh && dateToText(item.ngay_sinh)}
                </td>
                <td className="align-middle" style={styles.w_10}>
                  {phiMoiGioi[item.phi_moi_gioi]}
                </td>
                <td className="align-middle" style={styles.w_15}>
                  {item.ghi_chu}
                </td>
                <td className="align-middle">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ fontSize: 10 }}
                    onClick={() => openModalUpdate(item)}
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
