import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import json_config from "../config.json";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import Loading from "./components/loading";

export default function HuongCanHo() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [loading, setLoading] = useState(true);
  const huongCanHoRef = useRef(null);

  useEffect(() => {
    (async function getData() {
      try {
        const { data } = await axios.get(
          json_config.url_connect + "/thong-tin-du-an/huong-can-ho"
        );
        setLoading(false);
        setData(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  async function themhuongCanHo() {
    try {
      const dataPost = {
        huong_can_ho: huongCanHoRef.current.value,
      };

      if (dataPost.huong_can_ho === "") {
        toast.error("Dữ liệu trống");
        return;
      }

      const {
        status,
        data: { response, type, id },
      } = await axios.post(
        `${json_config.url_connect}/thong-tin-du-an/them-huong-can-ho`,
        dataPost
      );

      if (status == 200) {
        toast.success(response);
        if (type) {
          setLoading(false);
          setShowModal(false);
          setData((pre) => [...pre, { id, ...dataPost }]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function capNhathuongCanHo() {
    try {
      const dataPost = {
        huong_can_ho: huongCanHoRef.current.value,
        id: dataUpdate.id,
      };

      if (dataPost.huong_can_ho === "") {
        toast.error("Dữ liệu trống");
        return;
      }

      const {
        status,
        data: { response, type },
      } = await axios.post(
        `${json_config.url_connect}/thong-tin-du-an/cap-nhat-huong-can-ho`,
        dataPost
      );

      if (status == 200) {
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
                ref={huongCanHoRef}
                placeholder="Cập nhật hướng căn hộ..."
                defaultValue={dataUpdate.huong_can_ho}
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
            <th scope="col">STT</th>
            <th scope="col">Hướng ban công</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.huong_can_ho}</td>
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
