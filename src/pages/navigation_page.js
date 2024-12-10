import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Menu, Sidebar, MenuItem } from "react-pro-sidebar";
import { faUserTie } from "@fortawesome/free-solid-svg-icons/faUserTie";
import { myColor } from "../styles/color";
import {
  faChevronLeft,
  faChevronRight,
  faSignOut,
  faList,
  faDirections,
  faBuilding,
  faClinicMedical,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import {
  faIntercom,
  faRProject,
  faTypo3,
} from "@fortawesome/free-brands-svg-icons";

export default function NavigationPage({ child }) {
  const location = useLocation();

  return (
    <div style={{ display: "flex" }}>
      {location.pathname !== "/dang-nhap" && <SizeBar />}
      <div style={{ flex: 1 }}>{child}</div>
    </div>
  );
}
function SizeBar() {
  const navigator = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
          Welcome {isAdmin === "true" ? "Admin" : "Staff"}
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
          style={{ textAlign: "start" }}
          icon={<FontAwesomeIcon icon={faList} />}
          onClick={() => navigator("/can-ho")}
        >
          Danh sách căn hộ
        </MenuItem>

        <MenuItem
          style={{ textAlign: "start" }}
          icon={<FontAwesomeIcon icon={faRProject} />}
          onClick={() => navigator("/du-an")}
        >
          Dự án
        </MenuItem>

        <MenuItem
          style={{ textAlign: "start" }}
          icon={<FontAwesomeIcon icon={faDirections} />}
          onClick={() => navigator("/huong-can-ho")}
        >
          Hướng căn hộ
        </MenuItem>

        <MenuItem
          style={{ textAlign: "start" }}
          icon={<FontAwesomeIcon icon={faTypo3} />}
          onClick={() => navigator("/loai-can-ho")}
        >
          Loại căn hộ
        </MenuItem>
        <MenuItem
          style={{ textAlign: "start" }}
          icon={<FontAwesomeIcon icon={faIntercom} />}
          onClick={() => navigator("/noi-that")}
        >
          Nội thất
        </MenuItem>

        <MenuItem
          style={{ textAlign: "start" }}
          icon={<FontAwesomeIcon icon={faBuilding} />}
          onClick={() => navigator("/toa-nha")}
        >
          Tòa nhà
        </MenuItem>
        <MenuItem
          style={{ textAlign: "start" }}
          icon={<FontAwesomeIcon icon={faClinicMedical} />}
          onClick={() => navigator("/truc-can-ho")}
        >
          Trục căn hộ
        </MenuItem>
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
          style={{ textAlign: "start" }}
          icon={<FontAwesomeIcon icon={faSignOut} />}
        >
          Đăng xuất
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}
