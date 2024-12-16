import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Menu, Sidebar, MenuItem, SubMenu } from "react-pro-sidebar";
import { faUserTie } from "@fortawesome/free-solid-svg-icons/faUserTie";
import { myColor } from "../styles/color";
import {
  faChevronLeft,
  faChevronRight,
  faSignOut,
  faBuilding,
  faUser,
  faProjectDiagram,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/navigator.css";

export default function NavigationPage({ child }) {
  const location = useLocation();

  return (
    <div style={{ display: "flex" }}>
      {location.pathname !== "/dang-nhap" && location.pathname !== "/" && (
        <SizeBar />
      )}
      <div style={{ flex: 1 }}>{child}</div>
    </div>
  );
}
function SizeBar() {
  const navigator = useNavigate();
  const [taiKhoan, setTaiKhoan] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const tai_khoan = localStorage.getItem("tai_khoan");
    if (tai_khoan) {
      setTaiKhoan(tai_khoan);
    }
  }, []);

  return (
    <Sidebar collapsed={collapsed}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 100,
        }}
      >
        <FontAwesomeIcon
          icon={faUserTie}
          size="lg"
          style={{ marginLeft: 32 }}
          color={myColor.backgroundcolor}
        />
        <p
          style={{
            color: myColor.backgroundcolor,
            fontSize: 20,
            fontWeight: "bold",
            width: collapsed ? 0 : 200,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginTop: 15,
          }}
        >
          Welcome {taiKhoan}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 30,
        }}
      >
        <p
          style={{
            textAlign: "start",
            paddingLeft: "10px",
            fontSize: 11,
            fontWeight: "600",
            opacity: 0.5,
            height: 0,
          }}
        >
          Manager
        </p>
        {collapsed ? (
          <button
            style={{
              borderRadius: 20,
              paddingTop: 2,
              border: 0,
            }}
            onClick={() => {
              setCollapsed(false);
            }}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              color={myColor.backgroundcolor}
            />
          </button>
        ) : (
          <button
            style={{
              borderRadius: 20,
              paddingTop: 2,
              border: 0,
            }}
            onClick={() => {
              setCollapsed(true);
            }}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              color={myColor.backgroundcolor}
            />
          </button>
        )}
      </div>
      <Menu>
        <MenuItem
          className="item_menu"
          icon={<FontAwesomeIcon icon={faPerson} />}
          onClick={() => navigator("/nguoi-dung")}
        >
          Nhân viên
        </MenuItem>
        <MenuItem
          icon={<FontAwesomeIcon icon={faUser} />}
          className="item_menu"
          onClick={() => navigator("/khach-hang")}
        >
          Khách hàng
        </MenuItem>

        <SubMenu
          icon={<FontAwesomeIcon icon={faBuilding} />}
          label="Data nguồn"
          className="item_menu"
        >
          <MenuItem
            icon={<div></div>}
            className="item_menu"
            onClick={() => navigator("/can-ho")}
          >
            Data nguồn
          </MenuItem>
        </SubMenu>
        <SubMenu
          label="Trục căn"
          className="item_menu"
          icon={<FontAwesomeIcon icon={faProjectDiagram} />}
        >
          <MenuItem
            icon={<div></div>}
            className="item_menu"
            onClick={() => navigator("/du-an")}
          >
            Dự án
          </MenuItem>
          <MenuItem
            icon={<div></div>}
            onClick={() => navigator("/huong-can-ho")}
          >
            Hướng ban công
          </MenuItem>

          <MenuItem
            className="item_menu"
            icon={<div></div>}
            onClick={() => navigator("/loai-can-ho")}
          >
            Loại căn hộ
          </MenuItem>
          <MenuItem
            icon={<div></div>}
            className="item_menu"
            onClick={() => navigator("/noi-that")}
          >
            Nội thất
          </MenuItem>

          <MenuItem
            icon={<div></div>}
            className="item_menu"
            onClick={() => navigator("/toa-nha")}
          >
            Tòa nhà
          </MenuItem>
          <MenuItem
            icon={<div></div>}
            className="item_menu"
            onClick={() => navigator("/truc-can-ho")}
          >
            Trục căn hộ
          </MenuItem>
        </SubMenu>
      </Menu>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 30,
        }}
      >
        <p
          style={{
            textAlign: "start",
            paddingLeft: "10px",
            fontSize: 11,
            fontWeight: "600",
            opacity: 0.5,
            height: 0,
          }}
        >
          Logout
        </p>
      </div>
      <Menu>
        <MenuItem
          className="item_menu"
          onClick={() => navigator("/dang-nhap", { replace: true })}
          icon={<FontAwesomeIcon icon={faSignOut} />}
        >
          Đăng xuất
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}
