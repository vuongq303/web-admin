import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import Loading from "./components/loading";
import { REQUEST } from "../api/method";
import { useNavigate } from "react-router-dom";
import { authentication } from "./controllers/function";

export default function HuongCanHo() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [loading, setLoading] = useState(true);
  const huongCanHoRef = useRef(null);
  const navigation = useNavigate();

  useEffect(() => {
    (async function getData() {
      try {
        const {
          data: { status, data },
        } = await REQUEST.get("/thong-tin-du-an/huong-can-ho");

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

  function openModalUpdate(item) {
    setDataUpdate(item);
    setShowModalUpdate(true);
  }

  async function themhuongCanHo() {
    try {
      const dataPost = {
        huong_can_ho: huongCanHoRef.current.value,
      };

      if (dataPost.huong_can_ho === "") {
        toast.error("Dữ liệu trống");
        return;
      }

      setLoading(true);
      const {
        data: { status, id, response },
      } = await REQUEST.post("/thong-tin-du-an/them-huong-can-ho", dataPost);
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

  async function capNhatHuongCanHo() {
    try {
      const dataPost = {
        huong_can_ho: huongCanHoRef.current.value,
        id: dataUpdate.id,
      };

      if (dataPost.huong_can_ho === "") {
        toast.error("Dữ liệu trống");
        return;
      }
      setLoading(true);
      const {
        data: { status, response },
      } = await REQUEST.post(
        "/thong-tin-du-an/cap-nhat-huong-can-ho",
        dataPost
      );
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
            <Button variant="primary" onClick={capNhatHuongCanHo}>
              Cập nhật
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <table className="table table-hover table-bordered">
        <thead>
          <tr className="table-primary">
            <th scope="col">STT</th>
            <th scope="col">Hướng ban công</th>

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
                <td>{item.huong_can_ho}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}
