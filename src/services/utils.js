export const trangThaiLamViec = ["Đang làm việc", "Đã nghỉ làm"];

export const gioiTinhNguoiDung = ["Nam", "Nữ"];

export const loaiGiaoDichKhachHang = ["Bán", "Thuê", "Bán và Thuê"];

export const phanQuyenNguoiDung = ["Admin", "Nhân viên", "Quản lý", "CSKH"];

export const trangThaiDuAn = ["Còn bán", "Ngừng bán"];

export const locGiaCanHo = [
  "Giá bán tăng dần",
  "Giá bán giảm dần",
  "Giá thuê tăng dần",
  "Giá thuê giảm dần",
];

export const dataDuAn = () => {
  const data = localStorage.getItem("du-an");
  if (!data) window.location.replace("/");
  return JSON.parse(data);
};

export const dataHuongCanHo = () => {
  const data = localStorage.getItem("huong-can-ho");
  if (!data) window.location.replace("/");
  return JSON.parse(data);
};

export const dataTrucCanHo = () => {
  const data = localStorage.getItem("truc-can-ho");
  if (!data) window.location.replace("/");
  return JSON.parse(data);
};

export const dataLoaiCanHo = () => {
  const data = localStorage.getItem("loai-can-ho");
  if (!data) window.location.replace("/");
  return JSON.parse(data);
};

export const dataNoiThat = () => {
  const data = localStorage.getItem("noi-that");
  if (!data) window.location.replace("/");
  return JSON.parse(data);
};

export const dataToaNha = () => {
  const data = localStorage.getItem("toa-nha");
  if (!data) window.location.replace("/");
  return JSON.parse(data);
};

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
