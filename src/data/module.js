export const moduleTrangThaiLamViec = {
  dangLamViec: "Đang làm việc",
  daNghiLam: "Đã nghỉ làm",
};

export const moduleTrangThaiDuAn = {
  dangGiaoDich: "Đang giao dịch",
  ngungGiaoDich: "Ngừng giao dịch",
};

export const modulePhanQuyen = {
  admin: "Admin",
  quanLy: "Quản lý",
  cskh: "CSKH",
  sale: "Sale",
};

export const moduleDanhDau = {
  gray: "gray",
  yellow: "yellow",
  orange: "orange",
  red: "red",
  transparent: "",
};

export const dataCanHoDefault = {
  id: 0,
  gia_ban: 0,
  gia_thue: 0,
  trang_thai: 0,
  chu_can_ho: "",
  ma_can_ho: "",
  du_an: "",
  dien_tich: "",
  so_phong_ngu: 0,
  so_phong_tam: 0,
  huong_can_ho: "",
  loai_can_ho: "",
  noi_that: "",
  ghi_chu: "",
  nguoi_cap_nhat: "",
  ten_khach_hang: "",
  so_dien_thoai: "",
  loai_giao_dich: "",
  hinh_anh: "",
  ten_toa_nha: "",
  truc_can_ho: "",
  danh_dau: "",
};

export const columnMapping = {
  id: "Mã số",
  ten_du_an: "Dự án",
  ten_toa_nha: "Tên tòa nhà",
  ma_can_ho: "Mã căn hộ",
  truc_can_ho: "Trục căn hộ",
  chu_can_ho: "Chủ căn hộ",
  so_dien_thoai: "Số điện thoại",
  loai_can_ho: "Loại căn hộ",
  dien_tich: "Diện tích",
  so_phong_ngu: "Số phòng ngủ",
  so_phong_tam: "Số phòng tắm",
  gia_ban: "Giá bán",
  gia_thue: "Giá thuê",
  noi_that: "Nội thất",
  huong_can_ho: "Hướng căn hộ",
  ghi_chu: "Ghi chú",
  trang_thai: "Trạng thái",
  nguoi_cap_nhat: "Người cập nhật",
  hinh_anh: "Hình ảnh",
  danh_dau: "Đánh dấu",
};

export const excelImportFormat = [
  { ten_du_an: "Dự án" },
  { ten_toa_nha: "Tên tòa nhà" },
  { ma_can_ho: "Số tầng" },
  { truc_can_ho: "Trục căn hộ" },
  { chu_can_ho: "Chủ căn hộ" },
  { so_dien_thoai: "Số điện thoại" },
  { loai_can_ho: "Loại căn hộ" },
  { dien_tich: "Diện tích" },
  { so_phong_ngu: "Số phòng ngủ" },
  { so_phong_tam: "Số phòng tắm" },
  { gia_ban: "Giá bán" },
  { gia_thue: "Giá thuê" },
  { noi_that: "Nội thất" },
  { huong_can_ho: "Hướng căn hộ" },
  { ghi_chu: "Ghi chú" },
];

export const excelExportFormat = [
  "id",
  "ten_du_an",
  "ten_toa_nha",
  "ma_can_ho",
  "truc_can_ho",
  "chu_can_ho",
  "so_dien_thoai",
  "loai_can_ho",
  "dien_tich",
  "so_phong_ngu",
  "so_phong_tam",
  "gia_ban",
  "gia_thue",
  "noi_that",
  "huong_can_ho",
  "ghi_chu",
  "trang_thai",
  "nguoi_cap_nhat",
  "hinh_anh",
  "danh_dau",
];

export const baseURL = "http://192.168.29.55:8080";
