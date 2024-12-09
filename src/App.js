import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminManagement from "./pages/admin_page";
import PetCare from "./pages/pet_care";
import Payment from "./pages/payment";
import RevenueStatistics from "./pages/revenue_statistics";
import ProductCategories from "./pages/productCategories_management";
import ChatItemPage from "./pages/chat_item_page";
import NavigationPage from "./pages/navigation_page";
import CanHo from "./pages/can_ho";
import DangNhap from "./pages/dang_nhap";

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">
        <NavigationPage
          child={
            <Routes>
              <Route path="/dang-nhap" element={<DangNhap />} />
              <Route path="/can-ho" element={<CanHo />} />
              <Route path="/admin" element={<AdminManagement />} />
              <Route path="/confirm-product" element={<PetCare />} />
              <Route path="/payment" element={<Payment />} />
              <Route
                path="/revenue-tatistics"
                element={<RevenueStatistics />}
              />
              <Route path="/category" element={<ProductCategories />} />
              <Route path="/chat-item/:email" element={<ChatItemPage />} />
            </Routes>
          }
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
