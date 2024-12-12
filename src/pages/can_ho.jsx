import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import json_config from "../config.json";
import { Button, Modal, ToastContainer } from "react-bootstrap";
import {
  dataDuAn,
  dataHuongCanHo,
  dataLoaiCanHo,
  dataNoiThat,
  dataToaNha,
  loaiGiaoDichKhachHang,
} from "../services/utils";

export default function CanHo() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  useEffect(() => {
    (async function (req, res) {
      const { data } = await axios.get(`${json_config.url_connect}/can-ho`);
      setData(data);
    })();
  }, []);

  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoclose={200}
        hideprogressbar="false"
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
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Mã căn hộ</label>
              </div>
              <div className="form-floating">
                <input
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
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataDuAn().map((item, index) => (
                    <option key={item.id} value={item.id}>
                      {item.ten_du_an}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Tên dự án</label>
              </div>

              <div className="form-floating">
                <input
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
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataLoaiCanHo().map((item, index) => (
                    <option key={item.id} value={item.id}>
                      {item.loai_can_ho}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Loại căn hộ</label>
              </div>

              <div className="form-floating">
                <input
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
            </div>
            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataNoiThat().map((item, index) => (
                    <option key={item.id} value={item.id}>
                      {item.loai_noi_that}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Nội thất</label>
              </div>
              <div className="form-floating">
                <input
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
                  type="number"
                  defaultValue={0}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Giá thuê</label>
              </div>
            </div>
            <div>
              <label className="mb-3">Ghi chú</label>
              <div className="input-group mb-3">
                <textarea
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
            <Button variant="primary">Thêm mới</Button>
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
