export const trangThaiLamViec = ["Đang làm việc", "Đã nghỉ làm"];

export const gioiTinhNguoiDung = ["Nam", "Nữ"];

export const loaiGiaoDichKhachHang = ["Bán", "Thuê", "Bán và Thuê"];

export const phanQuyenNguoiDung = ["Admin", "Nhân viên", "Quản lý", "CSKH"];
export const dataPhanQuyen = ["Quản lý", "Nhân viên", "CSKH"];

export const trangThaiDuAn = ["Đang giao dịch", "Ngừng giao dịch"];

export const danhDauCanHo = [
  { mau_sac: "", noi_dung: "Mặc định" },
  { mau_sac: "yellow", noi_dung: "Vàng (Căn giá rẻ)" },
  {
    mau_sac: "red",
    noi_dung: "Đỏ (Căn ngoại giao, không gọi trực tiếp chủ nhà)",
  },
  { mau_sac: "orange", noi_dung: "Cam (Căn kết hợp)" },
];

export const locGiaCanHo = [
  "Giá bán tăng dần",
  "Giá bán giảm dần",
  "Giá thuê tăng dần",
  "Giá thuê giảm dần",
];

export function dateToText(isoString) {
  const date = new Date(isoString);
  const formattedDate = date.toISOString().split("T")[0];
  return formattedDate;
}

export function getRoleNguoiDung() {
  const data = localStorage.getItem("role");
  if (!data) window.location.replace("/");
  return data;
}
