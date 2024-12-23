import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import Loading from "./components/loading";
import { ketNoi } from "../data/module";

export default function DuAn() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState([]);
  const [loading, setLoading] = useState(true);
  const noiThatRef = useRef(null);

  useEffect(() => {
    (async function getData() {
      try {
        const { data } = await axios.get(
          `${ketNoi.url}/thong-tin-du-an/noi-that`
        );
        setLoading(false);
        setData(data);
      } catch (error) {
        setLoading(false);
        toast.error("Lỗi khi lấy dữ liệu");
      }
    })();
  }, []);

  async function themNoiThat() {
    const dataPost = { loai_noi_that: noiThatRef.current.value };

    if (dataPost.loai_noi_that === "") {
      toast.error("Dữ liệu trống");
      return;
    }

    setLoading(true);
    try {
      const {
        status,
        data: { response, type, id },
      } = await axios.post(
        `${ketNoi.url}/thong-tin-du-an/them-noi-that`,
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
      toast.error("Lỗi khi thêm nội thất");
    }
  }

  async function capNhatNoiThat() {
    const dataPost = {
      loai_noi_that: noiThatRef.current.value,
      id: dataUpdate.id,
    };

    if (dataPost.loai_noi_that === "") {
      toast.error("Dữ liệu trống");
      return;
    }
    setLoading(true);

    try {
      const {
        status,
        data: { response, type },
      } = await axios.post(
        `${ketNoi.url}/thong-tin-du-an/cap-nhat-noi-that`,
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
      toast.error("Lỗi khi cập nhật nội thất");
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
            <Modal.Title>Thêm nội thất mới</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <div className="input-group mb-3">
              <input
                ref={noiThatRef}
                placeholder="Thêm nội thất..."
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
            <Button variant="primary" onClick={themNoiThat}>
              Thêm mới
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showModalUpdate} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>Cập nhật nội thất</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModalUpdate(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <div className="input-group mb-3">
              <input
                ref={noiThatRef}
                placeholder="Cập nhật nội thất..."
                defaultValue={dataUpdate.loai_noi_that}
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
            <Button variant="primary" onClick={capNhatNoiThat}>
              Cập nhật
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">STT</th>
            <th scope="col">Nội thất</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.loai_noi_that}</td>
              <td>
                <button
                  type="button"
                  onClick={() => openModalUpdate(item)}
                  className="btn btn-primary"
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
