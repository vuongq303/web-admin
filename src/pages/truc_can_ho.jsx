import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import Loading from "./components/loading";
import { REQUEST } from "../api/method";
import { authentication } from "./controllers/function";
import { useNavigate } from "react-router-dom";

export default function () {
  const [data, setData] = useState([]);
  const navigation = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const trucCanHoRef = useRef(null);

  useEffect(() => {
    (async function () {
      try {
        const {
          data: { status, data },
        } = await REQUEST.get("/thong-tin-du-an/truc-can-ho");

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

  async function themTrucCanHo() {
    const dataPost = { truc_can: trucCanHoRef.current.value };

    try {
      if (dataPost.truc_can === "") {
        toast.error("Dữ liệu trống");
        return;
      }

      setLoading(true);
      const {
        data: { status, id, response },
      } = await REQUEST.post("/thong-tin-du-an/them-truc-can-ho", dataPost);
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
        data: { status, response },
      } = await REQUEST.post("/thong-tin-du-an/cap-nhat-truc-can-ho", dataPost);
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
      <table className="table table-hover table-bordered">
        <thead>
          <tr className="table-primary">
            <th scope="col">STT</th>
            <th scope="col">Trục căn hộ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const styles = {
              row: { cursor: "pointer" }
            }
            return (
              <tr key={index} style={styles.row} onClick={() => openModalUpdate(item)}>
                <td>{index + 1}</td>
                <td>{item.truc_can}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}
