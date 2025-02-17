import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-scroll";
import Sidebar from "../Nav/Sidebar";
import Backdrop from "../Elements/Backdrop";
import BurgerIcon from "../../../assets/svg/BurgerIcon";

export default function TopNavbar() {
  const [y, setY] = useState(window.scrollY);
  const [sidebarOpen, toggleSidebar] = useState(false);

  useEffect(() => {
    const handleScroll = () => setY(window.scrollY);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && <Backdrop toggleSidebar={toggleSidebar} />}
      <Wrapper className="flexCenter animate whiteBg" style={y > 100 ? { height: "60px" } : { height: "80px" }}>
        <NavInner className="container flexSpaceCenter">
          <Link className="pointer flexNullCenter" to="home" smooth={true}>
            <img src={require("../../../assets/img/favicon.ico")} height={30} width={30} alt="Logo" />
            <h1 style={{ marginLeft: "15px" }} className="font20 extraBold">
              Connect Home
            </h1>
          </Link>
          <BurderWrapper className="pointer" onClick={() => toggleSidebar(prev => !prev)}>
            <BurgerIcon />
          </BurderWrapper>
          <UlWrapper className="flexNullCenter">
            <li className="semiBold font15 pointer mx-2">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="home" spy={true} duration={0} smooth={false} offset={-80}>
                Trang chủ
              </Link>
            </li>
            <li className="semiBold font15 pointer mx-2">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="projects" spy={true} duration={0} smooth={false} offset={-80}>
                Dự án
              </Link>
            </li>
            <li className="semiBold font15 pointer mx-2">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="blog" spy={true} duration={0} smooth={false} offset={-80}>
                Tuyển dụng
              </Link>
            </li>
            <li className="semiBold font15 pointer mx-2">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="contact" spy={true} duration={0} smooth={false} offset={-80}>
                Liên hệ
              </Link>
            </li>

          </UlWrapper>
          <UlWrapperRight className="flexNullCenter">
            <li className="semiBold font15 pointer">
              <a href="/dang-nhap" style={{ padding: "10px 30px 10px 0" }}>
                Đăng nhập
              </a>
            </li>
            <li className="semiBold font15 pointer flexCenter">
              <a href="/" className="radius8 lightBg" style={{ padding: "10px 15px" }}>
                Đăng kí
              </a>
            </li>
          </UlWrapperRight>
        </NavInner>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.nav`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
`;
const NavInner = styled.div`
  position: relative;
  height: 100%;
`
const BurderWrapper = styled.button`
  outline: none;
  border: 0px;
  background-color: transparent;
  height: 100%;
  padding: 0 15px;
  display: none;
  @media (max-width: 760px) {
    display: block;
  }
`;
const UlWrapper = styled.ul`
  display: flex;
  @media (max-width: 760px) {
    display: none;
  }
`;
const UlWrapperRight = styled.ul`
  @media (max-width: 760px) {
    display: none;
  }
`;


