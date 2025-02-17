import React from "react";
import { Modal } from "react-bootstrap";

export default function Loading({ loading }) {
  const image = require("../../assets/img/connect_home.png");
  
  return (
    <Modal className="modal-sm" show={loading} backdrop="static">
      <Modal.Body>
        <div className="d-flex flex-row justify-content-around align-items-center">
          <img src={image} height={50} width={50} alt="Logo" />
          <div className="text-center">
            <strong>Connect Home Loading...</strong>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
