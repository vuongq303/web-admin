import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import "./css/css.css";
import { Menu, Sidebar, MenuItem, SubMenu } from "react-pro-sidebar";
import { faUserTie } from "@fortawesome/free-solid-svg-icons/faUserTie";
import { myColor } from "../styles/color";
import {
  faChevronLeft,
  faChevronRight,
  faSignOut,
  faBuilding,
  faProjectDiagram,
  faPerson,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getRoleNguoiDung } from "../services/utils";
import { ketNoi, modulePhanQuyen } from "../data/module";

export default function NavigationPage({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <SizeBar />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

function SizeBar() {
  const navigator = useNavigate();
  const [hoTen, setHoten] = useState("");
  const [role, setRole] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  useMemo(() => {
    (async function () {
      try {
        const {
          status,
          data: { ho_ten, phan_quyen },
        } = await axios.get(`${ketNoi.url}/phan-quyen`, {
          headers: {
            Authorization: getRoleNguoiDung(),
            "Content-Type": "application/json",
          },
        });
        if (status === 200) {
          setHoten(ho_ten);
          setRole(phan_quyen);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      height: 100,
    },
    tai_khoan: {
      color: myColor.backgroundcolor,
      fontSize: 20,
      fontWeight: "bold",
      width: collapsed ? 0 : 200,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      marginTop: 15,
    },
    container_manager: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: 30,
    },
    item_manager: {
      textAlign: "start",
      paddingLeft: "10px",
      fontSize: 11,
      fontWeight: "600",
      opacity: 0.5,
      height: 0,
    },
    collapsed: {
      borderRadius: 20,
      paddingTop: 2,
      border: 0,
    },
    container_logout: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: 30,
    },
    item_logout: {
      textAlign: "start",
      paddingLeft: "10px",
      fontSize: 11,
      fontWeight: "600",
      opacity: 0.5,
      height: 0,
    },
  };

  return (
    <Sidebar collapsed={collapsed}>
      <div style={styles.container}>
        <FontAwesomeIcon
          icon={faUserTie}
          size="lg"
          style={{ marginLeft: 32 }}
          color="#009fdb"
        />
        <p style={styles.tai_khoan}>{hoTen}</p>
      </div>
      <div style={styles.container_manager}>
        <p style={styles.item_manager}>Manager</p>
        {collapsed ? (
          <button style={styles.collapsed} onClick={() => setCollapsed(false)}>
            <FontAwesomeIcon
              icon={faChevronRight}
              color={myColor.backgroundcolor}
            />
          </button>
        ) : (
          <button style={styles.collapsed} onClick={() => setCollapsed(true)}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              color={myColor.backgroundcolor}
            />
          </button>
        )}
      </div>
      <Menu>
        {(role === modulePhanQuyen.admin ||
          role === modulePhanQuyen.quanLy) && (
          <MenuItem
            className="item-menu"
            icon={<FontAwesomeIcon icon={faPerson} />}
            onClick={() => navigator("/nguoi-dung")}
          >
            Nhân sự
          </MenuItem>
        )}

        {(role === modulePhanQuyen.admin ||
          role === modulePhanQuyen.quanLy) && (
          <MenuItem
            icon={<FontAwesomeIcon icon={faUser} />}
            className="item-menu"
            onClick={() => navigator("/khach-hang-nguon")}
          >
            Data khách hàng
          </MenuItem>
        )}

        {(role === modulePhanQuyen.admin ||
          role === modulePhanQuyen.quanLy ||
          role === modulePhanQuyen.cskh) && (
          <MenuItem
            icon={<FontAwesomeIcon icon={faUserTie} />}
            className="item-menu"
            onClick={() => navigator("/cham-soc-khach-hang")}
          >
            Chăm sóc khách hàng
          </MenuItem>
        )}

        {(role === modulePhanQuyen.admin ||
          role === modulePhanQuyen.quanLy ||
          role === modulePhanQuyen.sale) && (
          <SubMenu
            icon={<FontAwesomeIcon icon={faBuilding} />}
            label="Sale"
            className="item-menu"
          >
            <MenuItem
              icon={<div></div>}
              className="item-menu"
              onClick={() => navigator("/can-ho")}
            >
              Data nguồn
            </MenuItem>
            <MenuItem
              icon={<div></div>}
              className="item-menu"
              onClick={() => navigator("/can-ho-da-gui")}
            >
              Căn hộ đã yêu cầu
            </MenuItem>
            <MenuItem
              icon={<div></div>}
              className="item-menu"
              onClick={() => navigator("/can-ho-da-duyet")}
            >
              Căn hộ đã duyệt
            </MenuItem>
          </SubMenu>
        )}

        {(role === modulePhanQuyen.admin ||
          role === modulePhanQuyen.quanLy) && (
          <SubMenu
            label="Dự án"
            className="item-menu"
            icon={<FontAwesomeIcon icon={faProjectDiagram} />}
          >
            <MenuItem
              icon={<div></div>}
              className="item-menu"
              onClick={() => navigator("/du-an")}
            >
              Tên dự án
            </MenuItem>
            <MenuItem
              icon={<div></div>}
              onClick={() => navigator("/huong-can-ho")}
            >
              Hướng ban công
            </MenuItem>

            <MenuItem
              className="item-menu"
              icon={<div></div>}
              onClick={() => navigator("/loai-can-ho")}
            >
              Loại căn hộ
            </MenuItem>
            <MenuItem
              icon={<div></div>}
              className="item-menu"
              onClick={() => navigator("/noi-that")}
            >
              Nội thất
            </MenuItem>

            <MenuItem
              icon={<div></div>}
              className="item-menu"
              onClick={() => navigator("/toa-nha")}
            >
              Tòa nhà
            </MenuItem>
            <MenuItem
              icon={<div></div>}
              className="item-menu"
              onClick={() => navigator("/truc-can-ho")}
            >
              Trục căn hộ
            </MenuItem>
          </SubMenu>
        )}
      </Menu>
      <div style={styles.container_logout}>
        <p style={styles.item_logout}>Logout</p>
      </div>
      <Menu>
        <MenuItem
          className="item-menu"
          onClick={() => navigator("/dang-nhap", { replace: true })}
          icon={<FontAwesomeIcon icon={faSignOut} />}
        >
          Đăng xuất
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}
