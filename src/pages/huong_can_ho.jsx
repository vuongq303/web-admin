import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import Loading from "./components/loading";
import { REQUEST } from "../api/method";

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
        const {
          data: { status, data, response },
        } = await REQUEST.get("/thong-tin-du-an/huong-can-ho");

        setLoading(false);
        if (!status) {
          toast.error(response);
          return;
        }
        setData(data);
      } catch (error) {
        setLoading(false);
        toast.error("Lỗi khi lấy dữ liệu");
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
        data: { response, status, id },
      } = await REQUEST.post("/thong-tin-du-an/them-huong-can-ho", dataPost);
      setLoading(false);
      toast.success(response);

      if (status) {
        setShowModal(false);
        setData((pre) => [...pre, { id, ...dataPost }]);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Lỗi thêm hướng căn hộ");
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
        data: { response, status },
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
    } catch (error) {
      setLoading(false);
      toast.error("Lỗi cập nhật hướng căn hộ");
    }
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
      <table className="table table-striped table-bordered">
        <thead>
          <tr className="table-primary">
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
