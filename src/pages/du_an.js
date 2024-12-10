import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import json_config from "../config.json";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

export default function DuAn() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [id, setId] = useState(-1);
  const duAnRef = useRef(null);
  const duAnUpdateRef = useRef(null);

  async function getData() {
    try {
      const { data } = await axios.get(
        json_config.url_connect + "/thong-tin-du-an/du-an"
      );
      setData(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function themduAn() {
    try {
      if (duAnRef.current.value == "") {
        toast.error("Dữ liệu trống");
        return;
      }

      const { status, data } = await axios.post(
        `${json_config.url_connect}/thong-tin-du-an/them-du-an`,
        { ten_du_an: duAnRef.current.value }
      );

      if (status == 200) {
        if (data.affectedRows > 0) {
          toast.success("Thêm dự án mới thành công");
          setShowModal(false);
          await getData();
          return;
        }
        toast.error("Thêm dự án mới thất bại");
        return;
      }
      toast.error("Thêm dự án mới thất bại");
    } catch (error) {
      console.log(error);
    }
  }

  async function capNhatduAn() {
    try {
      if (duAnUpdateRef.current.value === "") {
        toast.error("Dữ liệu trống");
        return;
      }
      if (id === -1) {
        toast.error("Không xác định được vị trí");
        return;
      }

      const { status, data } = await axios.post(
        `${json_config.url_connect}/thong-tin-du-an/cap-nhat-du-an`,
        { ten_du_an: duAnUpdateRef.current.value, id: id }
      );

      if (status == 200) {
        if (data.affectedRows > 0) {
          toast.success("Cập nhật dự án mới thành công");
          setShowModalUpdate(false);
          await getData();
          return;
        }
        toast.error("Cập nhật dự án mới thất bại");
        return;
      }
      toast.error("Cập nhật dự án mới thất bại");
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
            <Modal.Title>Thêm dự án mới</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <div className="input-group mb-3">
              <input
                ref={duAnRef}
                placeholder="Thêm dự án..."
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
            <Button variant="primary" onClick={themduAn}>
              Thêm mới
            </Button>
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
            <div className="input-group mb-3">
              <input
                ref={duAnUpdateRef}
                placeholder="Cập nhật dự án..."
                defaultValue={duAnUpdateRef.current}
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
            <Button variant="primary" onClick={capNhatduAn}>
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
            <th scope="col">Tên dự án</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.ten_du_an}</td>

              <td>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    duAnUpdateRef.current = item.ten_du_an;
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
