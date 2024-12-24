import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import Loading from "./components/loading";
import { ketNoi } from "../data/module";

export default function () {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const trucCanHoRef = useRef(null);

  useEffect(() => {
    (async function () {
      try {
        const { data } = await axios.get(
          `${ketNoi.url}/thong-tin-du-an/truc-can-ho`
        );
        setLoading(false);
        setData(data);
      } catch (error) {
        setLoading(false);
        toast.error("Lỗi lấy dữ liệu");
      }
    })();
  }, []);

  async function themTrucCanHo() {
    const dataPost = { truc_can: trucCanHoRef.current.value };

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
        `${ketNoi.url}/thong-tin-du-an/them-truc-can-ho`,
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
      setLoading(false);
      toast.error("Lỗi thêm trục căn hộ");
    }
  }

  async function capNhatTrucCanHo() {
    const dataPost = {
      truc_can: trucCanHoRef.current.value,
      id: dataUpdate.id,
    };

    if (dataPost.truc_can === "") {
      toast.error("Dữ liệu trống");
      return;
    }

    setLoading(true);

    try {
      const {
        status,
        data: { response, type },
      } = await axios.post(
        `${ketNoi.url}/thong-tin-du-an/cap-nhat-truc-can-ho`,
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
      setLoading(false);
      toast.error("Lỗi cập nhật trục căn hộ");
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
        autoClose={500}
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
                ref={trucCanHoRef}
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
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">STT</th>
            <th scope="col">Trục căn hộ</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.truc_can}</td>
              <td>
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
