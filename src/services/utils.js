export const gioiTinhNguoiDung = ["Nam", "Nữ"];

export const loaiGiaoDichKhachHang = ["Bán", "Thuê", "Bán và Thuê"];

export const trangThaiDuAn = ["Đang giao dịch", "Ngừng giao dịch"];

export const phiMoiGioi = ["Đủ phí", "Chưa đủ phí"];

export const trangThaiYeuCau = ["Đang chờ", "Đã duyệt"];

export const dataSoPhongNgu = [1, 2, 3, 4, 5, 6];

export const danhDauCanHo = [
  { mau_sac: "", noi_dung: "Mặc định" },
  { mau_sac: "yellow", noi_dung: "Vàng (Căn giá rẻ)" },
  { mau_sac: "red", noi_dung: "Đỏ (Căn ngoại giao, không gọi trực tiếp chủ nhà)" },
  { mau_sac: "orange", noi_dung: "Cam (Căn kết hợp)" },
];

export const locGiaCanHo = [
  "Giá bán tăng dần",
  "Giá bán giảm dần",
  "Giá thuê tăng dần",
  "Giá thuê giảm dần",
];

export function dateToText(isoString) {
  if (!isoString) return null;
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function encodeId(number) {
  const prefix = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  const suffix = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  const encodedNumber = prefix + String(number) + suffix;
  return encodedNumber;
}

export function decodeId(encodedNumber) {
  if (encodedNumber === "") return "";
  const decodeNumber = encodedNumber.slice(2, -3);
  return decodeNumber;
}
