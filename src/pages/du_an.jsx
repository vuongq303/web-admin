import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import json_config from "../config.json";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import Loading from "./components/loading";

export default function DuAn() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataUpdate, setDataUpdate] = useState({});
  const duAnRef = useRef(null);

  useEffect(() => {
    (async function getData() {
      try {
        const { data } = await axios.get(
          json_config.url_connect + "/thong-tin-du-an/du-an"
        );
        setLoading(false);
        setData(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  async function themduAn() {
    try {
     
      const dataPost = {
        ten_du_an: duAnRef.current.value,
      };

      if (dataPost.ten_du_an == "") {
        toast.error("Dữ liệu trống");
        return;
      }
      setLoading(true);
      const {
        status,
        data: { response, type, id },
      } = await axios.post(
        `${json_config.url_connect}/thong-tin-du-an/them-du-an`,
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

  async function capNhatduAn() {
    try {
      
      const dataPost = {
        ten_du_an: duAnRef.current.value,
        id: dataUpdate.id,
      };

      if (dataPost.ten_du_an === "") {
        toast.error("Dữ liệu trống");
        return;
      }
      setLoading(true);
      const {
        status,
        data: { response, type },
      } = await axios.post(
        `${json_config.url_connect}/thong-tin-du-an/cap-nhat-du-an`,
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
                ref={duAnRef}
                placeholder="Cập nhật dự án..."
                defaultValue={dataUpdate.ten_du_an}
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
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.ten_du_an}</td>
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
