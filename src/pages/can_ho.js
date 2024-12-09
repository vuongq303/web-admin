import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import json_config from "../config.json";

export default function CanHo() {
  const [data, setData] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [isUpdate, setIsUdpdate] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [categories, setCategories] = useState([]);

  const _image = useRef();
  const _name = useRef();
  const _status = useRef();
  const _type = useRef();
  const _description = useRef();
  const _size = useRef();
  const _animals = useRef();
  const _sizePrice = useRef(null);
  const _sizeQuantity = useRef(null);

  useEffect(() => {
    (async function (req, res) {
      const { data } = await axios.get(`${json_config.url_connect}/can-ho`);
      setData(data);
    })();
  }, []);

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">STT</th>
          <th scope="col">Căn hộ</th>
          <th scope="col">Chủ căn hộ</th>
          <th scope="col">Số điện thoại</th>
          <th scope="col">Giá bán</th>
          <th scope="col">Giá thuê</th>
          <th scope="col">Thông tin bất động sản</th>
          <th scope="col">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            <td>{item.id}</td>
            <td>{item.ten_can_ho}</td>
            <td>{item.chu_can_ho}</td>
            <td>{item.so_dien_thoai}</td>
            <td>{item.gia_ban}</td>
            <td>{item.gia_thue}</td>
            <td>{item.thong_tin_can_ho}</td>

            <td>
              <button className="btn btn-primary">Update</button>
            </td>
            <td>
              <button className="btn btn-secondary">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
