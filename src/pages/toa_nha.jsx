import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import json_config from "../config.json";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

export default function DuAn() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [dataDuAn, setDataDuAn] = useState([]);

  const [duAn, setDuAn] = useState(-1);
  const [id, setId] = useState(-1);
  const [duAnUpdate, setDuAnUpdate] = useState(-1);

  const toaNhaRef = useRef(null);
  const toaNhaUpdateRef = useRef(null);

  function findIdByTenDuAn(tenDuAn) {
    const result = dataDuAn.find((du_an) => du_an.ten_du_an === tenDuAn);
    return result ? result.id : 0;
  }

  async function getData() {
    try {
      const { data } = await axios.get(
        json_config.url_connect + "/thong-tin-du-an/toa-nha-du-an"
      );
      const { du_an, toa_nha_du_an } = data;
      setDataDuAn(du_an);
      setData(toa_nha_du_an);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const changeDuAn = (event) => {
    setDuAn(event.target.value);
  };

  const changeDuAnUpdate = (event) => {
    setDuAnUpdate(event.target.value);
  };

  async function themtoaNha() {
    try {
      if (toaNhaRef.current.value === "") {
        toast.error("Dữ liệu trống");
        return;
      }

      const { status, data } = await axios.post(
        `${json_config.url_connect}/thong-tin-du-an/them-toa-nha`,
        { toa_nha: toaNhaRef.current.value, du_an: duAn }
      );

      if (status === 200) {
        if (data.affectedRows > 0) {
          toast.success("Thêm tòa nhà mới thành công");
          setShowModal(false);
          await getData();
          return;
        }
        toast.error("Thêm tòa nhà mới thất bại");
        return;
      }
      toast.error("Thêm tòa nhà mới thất bại");
    } catch (error) {
      console.log(error);
    }
  }

  async function capNhattoaNha() {
    try {
      if (toaNhaUpdateRef.current.value === "") {
        toast.error("Dữ liệu trống");
        return;
      }
      
      if (id === -1) {
        toast.error("Không xác định được vị trí");
        return;
      }

      const { status, data } = await axios.post(
        `${json_config.url_connect}/thong-tin-du-an/cap-nhat-toa-nha`,
        { toa_nha: toaNhaUpdateRef.current.value, id: id, du_an: duAnUpdate }
      );

      if (status === 200) {
        if (data.affectedRows > 0) {
          toast.success("Cập nhật tòa nhà mới thành công");
          setShowModalUpdate(false);
          await getData();
          return;
        }
        toast.error("Cập nhật tòa nhà mới thất bại");
        return;
      }
      toast.error("Cập nhật tòa nhà mới thất bại");
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
                value={duAn}
                onChange={changeDuAn}
              >
                {dataDuAn.map((du_an) => (
                  <option key={du_an.id} value={du_an.id}>
                    {du_an.ten_du_an}
                  </option>
                ))}
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={themtoaNha}>
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
                ref={toaNhaUpdateRef}
                placeholder="Cập nhật tòa nhà..."
                defaultValue={toaNhaUpdateRef.current}
                type="text"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
              <select
                className="form-select"
                value={duAnUpdate}
                onChange={changeDuAnUpdate}
                aria-label="Default select example"
              >
                {dataDuAn.map((du_an) => (
                  <option key={du_an.id} value={du_an.id}>
                    {du_an.ten_du_an}
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
            <Button variant="primary" onClick={capNhattoaNha}>
              Cập nhật
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/*  */}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Tên tòa nhà</th>
            <th scope="col">Tên dự án</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.ten_toa_nha}</td>
              <td>{item.ten_du_an}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    toaNhaUpdateRef.current = item.ten_toa_nha;
                    setDuAnUpdate(findIdByTenDuAn(item.ten_du_an));
                    setId(item.id);
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
