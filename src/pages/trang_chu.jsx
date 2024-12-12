import axios from "axios";
import React, { useEffect } from "react";
import json_config from "../config.json";

export default function TrangChu() {
  useEffect(() => {
    (async function () {
      try {
        const { data: du_an } = await axios.get(
          json_config.url_connect + "/thong-tin-du-an/du-an"
        );
        localStorage.setItem("du-an", JSON.stringify(du_an));

        const { data: huong_can_ho } = await axios.get(
          json_config.url_connect + "/thong-tin-du-an/huong-can-ho"
        );
        localStorage.setItem("huong-can-ho", JSON.stringify(huong_can_ho));

        const { data: loai_can_ho } = await axios.get(
          json_config.url_connect + "/thong-tin-du-an/loai-can-ho"
        );
        localStorage.setItem("loai-can-ho", JSON.stringify(loai_can_ho));

        const { data: noi_that } = await axios.get(
          json_config.url_connect + "/thong-tin-du-an/noi-that"
        );
        localStorage.setItem("noi-that", JSON.stringify(noi_that));

        const { data: toa_nha } = await axios.get(
          json_config.url_connect + "/thong-tin-du-an/toa-nha"
        );
        localStorage.setItem("toa-nha", JSON.stringify(toa_nha));
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => {
          window.location.href = "/dang-nhap";
        }}
      >
        Login
      </button>
    </div>
  );
}
