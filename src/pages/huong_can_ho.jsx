import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import json_config from "../config.json";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

export default function HuongCanHo() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [id, setId] = useState(-1);
  const huongCanHoRef = useRef(null);
  const huongCanHoUpdateRef = useRef(null);

  async function getData() {
    try {
      const { data } = await axios.get(
        json_config.url_connect + "/thong-tin-du-an/huong-can-ho"
      );
      setData(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function themhuongCanHo() {
    try {
      if (huongCanHoRef.current.value == "") {
        toast.error("Dữ liệu trống");
        return;
      }

      const { status, data } = await axios.post(
        `${json_config.url_connect}/thong-tin-du-an/them-huong-can-ho`,
        { huong_can_ho: huongCanHoRef.current.value }
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

  async function capNhathuongCanHo() {
    try {
      if (huongCanHoUpdateRef.current.value === "") {
        toast.error("Dữ liệu trống");
        return;
      }
      if (id === -1) {
        toast.error("Không xác định được vị trí");
        return;
      }

      const { status, data } = await axios.post(
        `${json_config.url_connect}/thong-tin-du-an/cap-nhat-huong-can-ho`,
        { huong_can_ho: huongCanHoUpdateRef.current.value, id: id }
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
            <Modal.Title>Thêm hướng căn hộ mới</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <div className="input-group mb-3">
              <input
                ref={huongCanHoRef}
                placeholder="Thêm hướng căn hộ..."
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
            <Button variant="primary" onClick={themhuongCanHo}>
              Thêm mới
            </Button>
          </Modal.Footer>
        </Modal>
        {/*  */}
        <Modal show={showModalUpdate} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>Cập nhật hướng căn hộ</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModalUpdate(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <div className="input-group mb-3">
              <input
                ref={huongCanHoUpdateRef}
                placeholder="Cập nhật hướng căn hộ..."
                defaultValue={huongCanHoUpdateRef.current}
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
            <Button variant="primary" onClick={capNhathuongCanHo}>
              Cập nhật
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Hướng ban công</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.huong_can_ho}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    huongCanHoUpdateRef.current = item.huong_can_ho;
                    setId(item.id);
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
