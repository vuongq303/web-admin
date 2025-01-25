import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import Loading from "./components/loading";
import { REQUEST } from "../api/method";
import { useNavigate } from "react-router-dom";
import { authentication } from "./controllers/function";

export default function LoaiCanHo() {
  const [data, setData] = useState([]);
  const navigation = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataUpdate, setDataUpdate] = useState({});
  const loaiCanHoRef = useRef(null);

  useEffect(() => {
    (async function getData() {
      try {
        const {
          data: { status, data },
        } = await REQUEST.get("/thong-tin-du-an/loai-can-ho");
        setLoading(false);
        if (status) {
          setData(data);
        }
      } catch ({
        response: {
          data: { response },
        },
      }) {
        authentication(navigation, response, toast);
      }
    })();
  }, []);

  async function themloaiCanHo() {
    try {
      const dataPost = {
        loai_can_ho: loaiCanHoRef.current.value,
      };

      if (dataPost.loai_can_ho === "") {
        toast.error("Dữ liệu trống");
        return;
      }
      setLoading(true);

      const {
        data: { id, status, response },
      } = await REQUEST.post("/thong-tin-du-an/them-loai-can-ho", dataPost);
      setLoading(false);
      toast.success(response);
      if (status) {
        setShowModal(false);
        setData((pre) => [...pre, { id, ...dataPost }]);
      }
    } catch ({
      response: {
        data: { response },
      },
    }) {
      setLoading(false);
      toast.error(response);
    }
  }

  async function capNhatloaiCanHo() {
    try {
      const dataPost = {
        loai_can_ho: loaiCanHoRef.current.value,
        id: dataUpdate.id,
      };

      if (dataPost.loai_can_ho === "") {
        toast.error("Dữ liệu trống");
        return;
      }
      setLoading(true);

      const {
        data: { status, response },
      } = await REQUEST.post("/thong-tin-du-an/cap-nhat-loai-can-ho", dataPost);
      setLoading(false);
      toast.success(response);
      if (status) {
        setShowModalUpdate(false);
        setData((pre) =>
          pre.map((item) => (item.id === dataPost.id ? dataPost : item))
        );
      }
    } catch ({
      response: {
        data: { response },
      },
    }) {
      setLoading(false);
      toast.error(response);
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
        autoClose={1000}
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
                ref={loaiCanHoRef}
                placeholder="Cập nhật loại căn hộ..."
                defaultValue={dataUpdate.loai_can_ho}
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
      <table className="table table-striped table-bordered">
        <thead>
          <tr className="table-primary">
            <th scope="col">STT</th>
            <th scope="col">Loại căn hộ</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.loai_can_ho}</td>
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
