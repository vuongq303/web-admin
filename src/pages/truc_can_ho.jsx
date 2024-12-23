import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import json_config from "../config.json";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import Loading from "./components/loading";

export default function DuAn() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});

  const trucCanHoRef = useRef(null);
  const trucCanHoUpdateRef = useRef(null);

  useEffect(() => {
    (async function () {
      try {
        const { data } = await axios.get(
          json_config.url_connect + "/thong-tin-du-an/truc-can-ho"
        );
        setData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  async function themTrucCanHo() {
    const dataPost = { truc_can: trucCanHoRef.current.value }

    try {
      if (dataPost.truc_can === "") {
        toast.error("Dữ liệu trống");
        return;
      }
      setLoading(true);
      const {
        status,
        data: { response, type, id },
      } = await axios.post(
        `${json_config.url_connect}/thong-tin-du-an/them-truc-can-ho`,
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

  async function capNhatTrucCanHo() {
    const dataPost = {
      truc_can: trucCanHoUpdateRef.current.value,
      id: dataUpdate.id,
    };

    if (dataPost.truc_can === "") {
      toast.error("Dữ liệu trống");
      return;
    }
    
    setLoading(true);

    try {
      if (dataPost.truc_can === "") {
        toast.error("Dữ liệu trống");
        return;
      }

      const {
        status,
        data: { response, type },
      } = await axios.post(
        `${json_config.url_connect}/thong-tin-du-an/cap-nhat-truc-can-ho`,
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
            <Modal.Title>Thêm trục căn hộ mới</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <div className="input-group mb-3">
              <input
                ref={trucCanHoRef}
                placeholder="Thêm trục căn hộ..."
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
            <Button variant="primary" onClick={themTrucCanHo}>
              Thêm mới
            </Button>
          </Modal.Footer>
        </Modal>
        {/*  */}
        <Modal show={showModalUpdate} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>Cập nhật trục căn hộ</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModalUpdate(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <div className="input-group mb-3">
              <input
                ref={trucCanHoUpdateRef}
                placeholder="Cập nhật trục căn hộ..."
                defaultValue={dataUpdate.truc_can}
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
            <Button variant="primary" onClick={capNhatTrucCanHo}>
              Cập nhật
            </Button>
          </Modal.Footer>
        </Modal>
        {/*  */}
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Trục căn hộ</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.truc_can}</td>
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
