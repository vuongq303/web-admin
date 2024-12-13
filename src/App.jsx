import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import NavigationPage from "./pages/navigation_page";
import CanHo from "./pages/can_ho";
import DangNhap from "./pages/dang_nhap";
import DuAn from "./pages/du_an";
import LoaiCanHo from "./pages/loai_can_ho";
import HuongCanHo from "./pages/huong_can_ho";
import NoiThat from "./pages/noi_that";
import ToaNha from "./pages/toa_nha";
import TrucCanHo from "./pages/truc_can_ho";
import KhachHang from "./pages/khach_hang";
import NguoiDung from "./pages/nguoi_dung";
import TrangChu from "./pages/trang_chu";

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">
        <NavigationPage
          child={
            <Routes>
              <Route path="/" element={<TrangChu />} />
              <Route path="/dang-nhap" element={<DangNhap />} />
              <Route path="/can-ho" element={<CanHo />} />
              <Route path="/du-an" element={<DuAn />} />
              <Route path="/huong-can-ho" element={<HuongCanHo />} />
              <Route path="/loai-can-ho" element={<LoaiCanHo />} />
              <Route path="/noi-that" element={<NoiThat />} />
              <Route path="/toa-nha" element={<ToaNha />} />
              <Route path="/truc-can-ho" element={<TrucCanHo />} />
              <Route path="/khach-hang" element={<KhachHang />} />
              <Route path="/nguoi-dung" element={<NguoiDung />} />
            </Routes>
          }
        />
      </BrowserRouter>
    </div>
  );
}

export default App;