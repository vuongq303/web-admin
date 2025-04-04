import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import Loading from "./components/loading";
import { dateToText, gioiTinhNguoiDung } from "../services/utils";
import { baseURL, dataDanhDau, trangThaiLamViec, dataPhanQuyen, } from "../data/module";
import { REQUEST } from "../api/method";
import { useNavigate } from "react-router-dom";
import { authentication } from "./controllers/function";

export default function () {
  const navigation = useNavigate();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [showImageUpdate, setShowImageUpdate] = useState("");
  const [showImage, setShowImage] = useState("");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    (async function getData() {
      try {
        const {
          data: { status, data },
        } = await REQUEST.get("/nguoi-dung");

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

  async function themNguoiDung() {
    try {
      const dataPost = {
        tai_khoan: taiKhoanRef.current.value,
        mat_khau: matKhauRef.current.value,
        ho_ten: hoTenRef.current.value,
        ngay_bat_dau: ngayBatDauRef.current.value,
        so_dien_thoai: soDienThoaiRef.current.value,
        ngay_sinh: ngaySinhRef.current.value,
        email: emailRef.current.value,
        phan_quyen: viTriRef.current.value,
        gioi_tinh: gioiTinhRef.current.value,
        trang_thai: trangThaiRef.current.value,
      };

      const formData = new FormData();
      formData.append("tai_khoan", dataPost.tai_khoan);
      formData.append("mat_khau", dataPost.mat_khau);
      formData.append("ho_ten", dataPost.ho_ten);
      formData.append("ngay_bat_dau", dataPost.ngay_bat_dau);
      formData.append("so_dien_thoai", dataPost.so_dien_thoai);
      formData.append("ngay_sinh", dataPost.ngay_sinh);
      formData.append("email", dataPost.email);
      formData.append("phan_quyen", dataPost.phan_quyen);
      formData.append("gioi_tinh", dataPost.gioi_tinh);
      formData.append("trang_thai", dataPost.trang_thai);
      formData.append("hinh_anh", hinhAnhRef.current.files[0]);

      if (
        dataPost.tai_khoan === "" ||
        dataPost.mat_khau === "" ||
        dataPost.ho_ten === "" ||
        dataPost.ngay_bat_dau === "" ||
        dataPost.so_dien_thoai === "" ||
        dataPost.ngay_sinh === "" ||
        dataPost.email === ""
      ) {
        toast.error("Không được để trống thông tin");
        return;
      }
      setLoading(true);

      const {
        data: { status, id, response },
      } = await REQUEST.post("/nguoi-dung/them-nguoi-dung", formData);

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

  async function capNhatNguoiDung() {
    try {
      const dataPost = {
        ho_ten: hoTenRef.current.value,
        tai_khoan: taiKhoanRef.current.value,
        ngay_bat_dau: ngayBatDauRef.current.value,
        so_dien_thoai: soDienThoaiRef.current.value,
        ngay_sinh: ngaySinhRef.current.value,
        email: emailRef.current.value,
        phan_quyen: viTriRef.current.value,
        gioi_tinh: gioiTinhRef.current.value,
        trang_thai: trangThaiRef.current.value,
        phan_quyen_old: dataUpdate.phan_quyen,
        id: dataUpdate.id,
      };
      console.log(dataUpdate.phan_quyen);

      const formData = new FormData();
      formData.append("id", dataPost.id);
      formData.append("ho_ten", dataPost.ho_ten);
      formData.append("tai_khoan", dataPost.tai_khoan);
      formData.append("ngay_bat_dau", dataPost.ngay_bat_dau);
      formData.append("so_dien_thoai", dataPost.so_dien_thoai);
      formData.append("ngay_sinh", dataPost.ngay_sinh);
      formData.append("email", dataPost.email);
      formData.append("phan_quyen", dataPost.phan_quyen);
      formData.append("gioi_tinh", dataPost.gioi_tinh);
      formData.append("trang_thai", dataPost.trang_thai);
      formData.append("phan_quyen_old", dataPost.phan_quyen_old);
      formData.append("hinh_anh", hinhAnhRef.current.files[0]);

      if (
        dataPost.tai_khoan === "" ||
        dataPost.ho_ten === "" ||
        dataPost.ngay_bat_dau === "" ||
        dataPost.so_dien_thoai === "" ||
        dataPost.ngay_sinh === "" ||
        dataPost.email === ""
      ) {
        toast.error("Không được để trống thông tin");
        return;
      }

      setLoading(true);
      const {
        data: { status, response },
      } = await REQUEST.post("/nguoi-dung/cap-nhat-nguoi-dung", formData);
      setLoading(false);
      toast.success(response);
      if (status) {
        setShowModalUpdate(false);
        setData((pre) =>
          pre.map((item) =>
            item.id === dataPost.id ? { ...item, ...dataPost } : item
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

  function themAnhNguoiDung(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setShowImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  function capNhatAnhNguoiDung(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setShowImageUpdate(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  function openModalUpdate(item) {
    const imageBaseURL = `${baseURL}/nguoi-dung/${item.tai_khoan}.png`;
    setShowImageUpdate(imageBaseURL);
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
                  ref={viTriRef}>
                  {dataPhanQuyen.map((item, index) => (
                    <option key={index} value={index}>
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
                    <option key={index} value={index}>
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
                  onChange={themAnhNguoiDung}
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
                  {dataPhanQuyen.map((item, index) => (
                    <option key={index} value={index}>
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
                    <option key={index} value={index}>
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
                  onChange={capNhatAnhNguoiDung}
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
            <Button
              variant="primary"
              onClick={capNhatNguoiDung}
            >
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
            <th scope="col">Tài khoản</th>
            <th scope="col">Ngày bắt đầu</th>
            <th scope="col">Số điện thoại</th>
            <th scope="col">Email</th>
            <th scope="col">Ngày sinh</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Vị trí</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const styles = {
              danh_dau: {
                display: "inline-block",
                backgroundColor: dataDanhDau[item.trang_thai ?? 0],
                padding: "1px 5px",
                borderRadius: "5px",
              },
              row: { cursor: "pointer" }
            };

            return (
              <tr key={index} style={styles.row} onClick={() => openModalUpdate(item)}>
                <td className="align-middle">{index + 1}</td>
                <td className="align-middle">
                  <div style={styles.danh_dau}>{item.ho_ten}</div>
                </td>
                <td className="align-middle">{item.tai_khoan}</td>
                <td className="align-middle">
                  {dateToText(item.ngay_bat_dau)}
                </td>
                <td className="align-middle">{item.so_dien_thoai}</td>
                <td className="align-middle">{item.email}</td>
                <td className="align-middle">{dateToText(item.ngay_sinh)}</td>
                <td className="align-middle">{trangThaiLamViec[item.trang_thai ?? 0]}</td>
                <td className="align-middle">{dataPhanQuyen[item.phan_quyen ?? 0]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
