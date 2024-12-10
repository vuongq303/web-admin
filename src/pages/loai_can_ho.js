import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import json_config from "../config.json";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

export default function LoaiCanHo() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [id, setId] = useState(-1);
  const loaiCanHoRef = useRef(null);
  const loaiCanHoUpdateRef = useRef(null);

  async function getData() {
    try {
      const { data } = await axios.get(
        json_config.url_connect + "/thong-tin-du-an/loai-can-ho"
      );
      setData(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function themloaiCanHo() {
    try {
      if (loaiCanHoRef.current.value == "") {
        toast.error("Dữ liệu trống");
        return;
      }

      const { status, data } = await axios.post(
        `${json_config.url_connect}/thong-tin-du-an/them-loai-can-ho`,
        { loai_can_ho: loaiCanHoRef.current.value }
      );

      if (status == 200) {
        if (data.affectedRows > 0) {
          toast.success("Thêm loại căn hộ mới thành công");
          setShowModal(false);
          await getData();
          return;
        }
        toast.error("Thêm loại căn hộ mới thất bại");
        return;
      }
      toast.error("Thêm loại căn hộ mới thất bại");
    } catch (error) {
      console.log(error);
    }
  }

  async function capNhatloaiCanHo() {
    try {
      if (loaiCanHoUpdateRef.current.value === "") {
        toast.error("Dữ liệu trống");
        return;
      }
      if (id === -1) {
        toast.error("Không xác định được vị trí");
        return;
      }

      const { status, data } = await axios.post(
        `${json_config.url_connect}/thong-tin-du-an/cap-nhat-loai-can-ho`,
        { loai_can_ho: loaiCanHoUpdateRef.current.value, id: id }
      );

      if (status == 200) {
        if (data.affectedRows > 0) {
          toast.success("Cập nhật loại căn hộ mới thành công");
          setShowModalUpdate(false);
          await getData();
          return;
        }
        toast.error("Cập nhật loại căn hộ mới thất bại");
        return;
      }
      toast.error("Cập nhật loại căn hộ mới thất bại");
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
        <Modal show={showModal} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>Thêm loại căn hộ mới</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <div className="input-group mb-3">
              <input
                ref={loaiCanHoRef}
                placeholder="Thêm loại căn hộ..."
                type="text"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={themloaiCanHo}>
              Thêm mới
            </Button>
          </Modal.Footer>
        </Modal>
        {/*  */}
        <Modal show={showModalUpdate} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>Cập nhật loại căn hộ</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModalUpdate(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <div className="input-group mb-3">
              <input
                ref={loaiCanHoUpdateRef}
                placeholder="Cập nhật loại căn hộ..."
                defaultValue={loaiCanHoUpdateRef.current}
                type="text"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
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
            <Button variant="primary" onClick={capNhatloaiCanHo}>
              Cập nhật
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/*  */}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Loại căn hộ</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.loai_can_ho}</td>

              <td>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    loaiCanHoUpdateRef.current = item.loai_can_ho;
                    setId(item.id);
                    setShowModalUpdate(true);
                  }}
                >
                  Cập nhật
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
