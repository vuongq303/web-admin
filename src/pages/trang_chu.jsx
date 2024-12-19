import axios from "axios";
import React, { useEffect } from "react";
import json_config from "../config.json";

export default function TrangChu() {
  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => window.location.replace("/dang-nhap")}
      >
        Login
      </button>
    </div>
  );
}
