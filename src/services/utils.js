export const trangThaiLamViec = ["Đang làm việc", "Đã nghỉ làm"];

export const gioiTinhNguoiDung = ["Nam", "Nữ"];

export const loaiGiaoDichKhachHang = ["Bán", "Thuê"];

export function phan_quyen(id) {
  return getPhanQuyenLocalStorage()[id - 1].phan_quyen ?? "";
}

export function dateToText(isoString) {
  const date = new Date(isoString);
  const formattedDate = date.toISOString().split("T")[0];
  return formattedDate;
}

export function getPhanQuyenLocalStorage() {
  const phanQuyen = JSON.parse(localStorage.getItem("phan-quyen"));
  return phanQuyen;
}
