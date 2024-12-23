import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import json_config from "../config.json";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import Loading from "./components/loading";

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
          json_config.url_connect + "/thong-tin-du-an/noi-that"
        );
        setData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  async function themNoiThat() {
    const dataPost = { loai_noi_that: noiThatRef.current.value };
    try {
      if (dataPost.loai_noi_that === "") {
        toast.error("Dữ liệu trống");
        return;
      }
      setLoading(true);
      const {
        status,
        data: { response, type, id },
      } = await axios.post(
        `${json_config.url_connect}/thong-tin-du-an/them-noi-that`,
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
      console.log(error);
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
      if (dataPost.id === "") {
        toast.error("Dữ liệu trống");
        return;
      }

      const {
        status,
        data: { response, type },
      } = await axios.post(
        `${json_config.url_connect}/thong-tin-du-an/cap-nhat-noi-that`,
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
        {/*  */}
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
      {/*  */}
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
                  onClick={() => {
                    setDataUpdate(item);
                    setShowModalUpdate(true);
                  }}
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
