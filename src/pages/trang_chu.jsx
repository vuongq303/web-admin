import React, { useEffect } from "react";

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
