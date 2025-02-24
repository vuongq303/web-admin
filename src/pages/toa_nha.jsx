import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import Loading from "./components/loading";
import { REQUEST } from "../api/method";
import { authentication } from "./controllers/function";
import { useNavigate } from "react-router-dom";

export default function DuAn() {
  const [data, setData] = useState([]);
  const navigation = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataDuAn, setDataDuAn] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [loading, setLoading] = useState(true);
  const toaNhaRef = useRef(null);
  const tenDuAnRef = useRef(null);

  useEffect(() => {
    (async function getData() {
      try {
        const {
          data: {
            status,
            data: { toa_nha, du_an },
          },
        } = await REQUEST.get("/thong-tin-du-an/toa-nha");
        setLoading(false);
        if (status) {
          setData(toa_nha);
          setDataDuAn(du_an);
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

  async function themToaNha() {
    const dataPost = {
      ten_toa_nha: toaNhaRef.current.value,
      ten_du_an: tenDuAnRef.current.value,
    };

    if (dataPost.toa_nha === "") {
      toast.error("Dữ liệu trống");
      return;
    }
    setLoading(true);

    try {
      const {
        data: { status, id, response },
      } = await REQUEST.post("/thong-tin-du-an/them-toa-nha", dataPost);
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

  function openModalUpdate(item) {
    setDataUpdate(item);
    setShowModalUpdate(true);
  }

  async function capNhatToaNha() {
    const dataPost = {
      ten_toa_nha: toaNhaRef.current.value,
      ten_du_an: tenDuAnRef.current.value,
      id: dataUpdate.id,
    };

    if (dataPost.ten_toa_nha === "") {
      toast.error("Dữ liệu trống");
      return;
    }
    setLoading(true);

    try {
      const {
        data: { status, response },
      } = await REQUEST.post("/thong-tin-du-an/cap-nhat-toa-nha", dataPost);
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
        {/*Add  */}
        <Modal show={showModal} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>Thêm tòa nhà mới</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <div className="input-group mb-3">
              <input
                ref={toaNhaRef}
                placeholder="Thêm tòa nhà..."
                type="text"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
              <select
                className="form-select"
                aria-label="Default select example"
                ref={tenDuAnRef}
              >
                {dataDuAn.map((item, index) => (
                  <option key={index} value={item.ten_du_an}>
                    {item.ten_du_an}
                  </option>
                ))}
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={themToaNha}>
              Thêm mới
            </Button>
          </Modal.Footer>
        </Modal>
        {/*  Update*/}
        <Modal show={showModalUpdate} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>Cập nhật tòa nhà</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModalUpdate(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <div className="input-group mb-3">
              <input
                ref={toaNhaRef}
                placeholder="Cập nhật tòa nhà..."
                defaultValue={dataUpdate.ten_toa_nha}
                type="text"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
              <select
                className="form-select"
                defaultValue={dataUpdate.ten_du_an}
                ref={tenDuAnRef}
                aria-label="Default select example"
              >
                {dataDuAn.map((item, index) => (
                  <option key={index} value={item.ten_du_an}>
                    {item.ten_du_an}
                  </option>
                ))}
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModalUpdate(false)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={capNhatToaNha}>
              Cập nhật
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <table className="table table-hover table-bordered">
        <thead>
          <tr className="table-primary">
            <th scope="col">STT</th>
            <th scope="col">Tên tòa nhà</th>
            <th scope="col">Tên dự án</th>
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
                <td>{item.ten_toa_nha}</td>
                <td>{item.ten_du_an}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}
