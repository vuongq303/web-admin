import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import * as xlsx from "xlsx";
import { danhDauCanHo, dateToText, locGiaCanHo } from "../services/utils";
import PreviewImage from "./components/preview_image";
import { toast, ToastContainer } from "react-toastify";
import { downloadImages, exportFileExcel } from "./controllers/function";
import { baseURL, dataCanHoDefault, excelImportFormat } from "../data/module";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { REQUEST } from "../api/method";

export default function CanHo() {
  const limitRow = 50;
  const [data, setData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pages, setPages] = useState(1);
  const [timKiemPages, setTimeKiemPages] = useState(1);
  const [isTimKiem, setIsTimKiem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [giaBanTuState, setGiaBanTuState] = useState("");
  const [giaBanDenState, setGiaBanDenState] = useState("");
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalHinhAnh, setShowModalHinhAnh] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(dataCanHoDefault);
  const [isDisableLoadMore, setIsDisableLoadMore] = useState(false);
  const [showImageData, setShowImageData] = useState([]);
  const [dataToaNhaDuAn, setDataToaNhaDuAn] = useState([]);
  const [dataDuAn, setDataDuAn] = useState([]);
  const [dataHuongCanHo, setDataHuongCanHo] = useState([]);
  const [dataLoaiCanHo, setDataLoaiCanHo] = useState([]);
  const [dataNoiThat, setDataNoiThat] = useState([]);
  const [dataToaNha, setDataToaNha] = useState([]);
  const [dataTrucCanHo, setDataTrucCanHo] = useState([]);
  const [itemChecked, setItemChecked] = useState([]);
  const tenToaNhaRef = useRef(null);
  const maCanHoRef = useRef(null);
  const hoTenChuCanHoRef = useRef(null);
  const soDienThoaiRef = useRef(null);
  const tenDuAnRef = useRef(null);
  const soPhongNguRef = useRef(null);
  const soPhongTamRef = useRef(null);
  const loaiCanHoRef = useRef(null);
  const dienTichRef = useRef(null);
  const huongBanCongRef = useRef(null);
  const noiThatRef = useRef(null);
  const giaBanRef = useRef(null);
  const giaThueRef = useRef(null);
  const ghiChuRef = useRef(null);
  const hinhAnhRef = useRef(null);
  const trucCanHoRef = useRef(null);
  const locGiaCanHoRef = useRef(null);
  const danhDauCanHoRef = useRef(null);
  const tenDuAnTimKiemRef = useRef(null);
  const tenToaNhaTimKiemRef = useRef(null);
  const loaiNoiThatTimKiemRef = useRef(null);
  const loaiCanHoTimKiemRef = useRef(null);
  const huongCanHoTimKiemRef = useRef(null);
  const soPhongNguTimKiemRef = useRef(null);
  const trucCanHoTimKiemRef = useRef(null);
  const uploadFileExcelRef = useRef(null);

  function showImage(item) {
    if (item.hinh_anh) {
      let arrayHinhAnh = item.hinh_anh.split(",");
      setShowImageData(
        arrayHinhAnh.map((img) => `${baseURL}/can-ho/${item.id}/${img}`)
      );
    } else {
      setShowImageData([]);
    }
    setDataUpdate(item);
    setShowModalHinhAnh(true);
  }

  async function guiYeuCau(id) {
    try {
      setLoading(true);
      const {
        data: { response, status },
      } = await REQUEST.post("/yeu-cau/gui-yeu-cau", { can_ho: id });
      setLoading(false);
      if (status) {
        toast.success(response);
        return;
      }
      toast.success(response);
    } catch (error) {
      setLoading(false);
      toast.error("Lỗi gửi yêu cầu");
    }
  }

  async function getData(page) {
    try {
      const {
        data: { data, isAdmin, status, response },
      } = await REQUEST.get("/can-ho", {
        params: {
          limit: limitRow,
          offset: (page - 1) * limitRow,
        },
      });
      if (!status) {
        toast.error(response);
        return [];
      }

      setIsAdmin(isAdmin);
      return data;
    } catch (error) {
      setLoading(false);
    }
  }

  async function timKiem(page) {
    try {
      let dataTimKiem = {
        ten_du_an: tenDuAnTimKiemRef.current.value,
        ten_toa_nha: tenToaNhaTimKiemRef.current.value,
        loai_noi_that: loaiNoiThatTimKiemRef.current.value,
        loai_can_ho: loaiCanHoTimKiemRef.current.value,
        huong_can_ho: huongCanHoTimKiemRef.current.value,
        so_phong_ngu: soPhongNguTimKiemRef.current.value,
        truc_can_ho: trucCanHoTimKiemRef.current.value,
        loc_gia: locGiaCanHoRef.current.value,
        gia_tu: giaBanTuState.replace(/,/g, ""),
        gia_den: giaBanDenState.replace(/,/g, ""),
        limit: limitRow,
        offset: (page - 1) * limitRow,
      };

      setLoading(true);
      setIsTimKiem(true);
      const {
        data: { response, status, data },
      } = await REQUEST.get(`/tim-kiem/${isAdmin ? "admin" : "sale"}`, {
        params: dataTimKiem,
      });

      setLoading(false);
      if (status) {
        return data;
      }

      toast.error(response);
      return [];
    } catch (error) {
      setLoading(false);
      toast.error("Lỗi tìm kiếm");
    }
  }

  async function lamMoi() {
    setLoading(true);
    tenDuAnTimKiemRef.current.value = "";
    tenToaNhaTimKiemRef.current.value = "";
    loaiNoiThatTimKiemRef.current.value = "";
    loaiCanHoTimKiemRef.current.value = "";
    huongCanHoTimKiemRef.current.value = "";
    soPhongNguTimKiemRef.current.value = "";
    trucCanHoTimKiemRef.current.value = "";
    locGiaCanHoRef.current.value = "";
    setGiaBanTuState("");
    setGiaBanDenState("");
    setDataToaNha([]);
    setPages(1);
    setTimeKiemPages(1);
    setIsDisableLoadMore(false);
    const data = await getData(1);
    setLoading(false);
    setData(data);
  }

  async function capNhatAnhCanHo(event) {
    try {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      const formData = new FormData();
      formData.append("id", dataUpdate.id);
      files.forEach((file) => {
        formData.append("hinh_anh", file);
      });
      setLoading(true);
      const {
        data: { response: message, data: images, status },
      } = await REQUEST.post("/can-ho/them-anh-can-ho", formData);
      toast.success(message);
      setLoading(false);
      if (status) {
        setShowImageData(
          images.map((img) => `${baseURL}/can-ho/${dataUpdate.id}/${img}`)
        );
        setData((prevData) =>
          prevData.map((item) =>
            item.id === dataUpdate.id
              ? { ...item, hinh_anh: images.join(",") }
              : item
          )
        );
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  const xoaAnhCanHo = async (index) => {
    if (!isAdmin) {
      toast.error("Bạn không thể xóa ảnh");
      return;
    }

    const listImgPath = showImageData[index].split("/");
    const imgPath = listImgPath[listImgPath.length - 1];
    setLoading(true);
    try {
      const {
        data: { response: message, data: images, status },
      } = await REQUEST.post("/can-ho/xoa-anh-can-ho", {
        id: dataUpdate.id,
        filename: imgPath,
      });
      toast.success(message);
      setLoading(false);

      if (status) {
        setShowImageData(
          images.map((img) => `${baseURL}/can-ho/${dataUpdate.id}/${img}`)
        );
        setData((prevData) =>
          prevData.map((item) =>
            item.id === dataUpdate.id
              ? { ...item, hinh_anh: images.join(",") }
              : item
          )
        );
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  async function themCanHo() {
    try {
      const dataPost = {
        ten_toa_nha: tenToaNhaRef.current.value,
        ma_can_ho: maCanHoRef.current.value,
        chu_can_ho: hoTenChuCanHoRef.current.value,
        so_dien_thoai: soDienThoaiRef.current.value,
        ten_du_an: tenDuAnRef.current.value,
        so_phong_ngu: soPhongNguRef.current.value,
        so_phong_tam: soPhongTamRef.current.value,
        loai_can_ho: loaiCanHoRef.current.value,
        dien_tich: dienTichRef.current.value,
        huong_can_ho: huongBanCongRef.current.value,
        noi_that: noiThatRef.current.value,
        gia_ban: giaBanRef.current.value,
        gia_thue: giaThueRef.current.value,
        ghi_chu: ghiChuRef.current.value,
        truc_can_ho: trucCanHoRef.current.value,
        danh_dau: danhDauCanHoRef.current.value,
        trang_thai: 0,
      };

      if (
        dataPost.ten_toa_nha === "" ||
        dataPost.ma_can_ho === "" ||
        dataPost.truc_can_ho === "" ||
        dataPost.so_phong_ngu === "" ||
        dataPost.so_phong_tam === "" ||
        dataPost.dien_tich === "" ||
        dataPost.gia_ban === "" ||
        dataPost.gia_thue === ""
      ) {
        toast.error("Kiểm tra lại dữ liệu");
        return;
      }

      setLoading(true);
      const {
        data: { response, status, id, nguoi_cap_nhat, ngay_cap_nhat },
      } = await REQUEST.post("/can-ho/them-can-ho", dataPost);
      toast.success(response);
      setLoading(false);

      if (status) {
        setShowModal(false);
        setData((pre) => [
          { id, nguoi_cap_nhat, ngay_cap_nhat, ...dataPost },
          ...pre,
        ]);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
      console.error("Lỗi khi thêm căn hộ:", error);
    }
  }

  useEffect(() => {
    (async function () {
      setLoading(true);
      try {
        const { data: response } = await REQUEST.get("/thong-tin-du-an");
        const { toa_nha, huong_can_ho, loai_can_ho, noi_that, truc_can_ho } =
          response;

        const listDuAn = [...new Set(toa_nha.map((item) => item.ten_du_an))];
        const listToaNha = toa_nha.map((item) => item.ten_toa_nha);

        setDataDuAn(listDuAn);
        setDataToaNha(listToaNha);
        setDataToaNhaDuAn(toa_nha);
        setDataHuongCanHo(huong_can_ho);
        setDataLoaiCanHo(loai_can_ho);
        setDataNoiThat(noi_that);
        setDataTrucCanHo(truc_can_ho);
        const data = await getData(pages);

        setLoading(false);
        setData(data);
      } catch (error) {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (pages !== 1) {
        setLoading(true);
        const data = await getData(pages);
        setLoading(false);
        if (data.length < limitRow) {
          setIsDisableLoadMore(true);
        }
        setData((pre) => [...pre, ...data]);
      }
    })();
  }, [pages]);

  useEffect(() => {
    (async function () {
      if (timKiemPages !== 1) {
        const dataTimKiem = await timKiem(timKiemPages);
        if (dataTimKiem.length < limitRow) {
          setIsDisableLoadMore(true);
        }
        setData((pre) => [...pre, ...dataTimKiem]);
      }
    })();
  }, [timKiemPages]);

  async function capNhatCanHo() {
    try {
      const dataPost = {
        chu_can_ho: hoTenChuCanHoRef.current.value,
        so_dien_thoai: soDienThoaiRef.current.value,
        so_phong_ngu: soPhongNguRef.current.value,
        so_phong_tam: soPhongTamRef.current.value,
        loai_can_ho: loaiCanHoRef.current.value,
        dien_tich: dienTichRef.current.value,
        huong_can_ho: huongBanCongRef.current.value,
        noi_that: noiThatRef.current.value,
        gia_ban: giaBanRef.current.value,
        gia_thue: giaThueRef.current.value,
        ghi_chu: ghiChuRef.current.value,
        danh_dau: danhDauCanHoRef.current.value,
        id: dataUpdate.id,
      };

      if (
        dataPost.so_phong_ngu === "" ||
        dataPost.so_phong_tam === "" ||
        dataPost.dien_tich === "" ||
        dataPost.gia_ban === "" ||
        dataPost.gia_thue === ""
      ) {
        toast.error("Kiểm tra lại dữ liệu");
        return;
      }
      setLoading(true);
      const {
        data: { response: message, status, nguoi_cap_nhat, ngay_cap_nhat },
      } = await REQUEST.post("/can-ho/cap-nhat-can-ho", dataPost);
      toast.success(message);
      setLoading(false);

      if (status) {
        setShowModalUpdate(false);
        setData((prev) =>
          prev.map((item) =>
            item.id === dataPost.id
              ? { ...item, ...dataPost, nguoi_cap_nhat, ngay_cap_nhat }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật căn hộ:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    }
  }

  const uploadFileExcel = () => {
    try {
      const fileExcel = uploadFileExcelRef.current.files[0];
      if (!fileExcel) {
        console.error("No file selected!");
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        const header = rows[0];

        const invalidColumns = header.filter(
          (column) =>
            !excelImportFormat.some((item) => Object.values(item)[0] === column)
        );
        if (invalidColumns.length > 0) {
          toast.error(`Cột không hợp lệ: ${invalidColumns.toString()}`);
          return;
        }
        const validData = rows
          .slice(1)
          .filter((row) => row.some((cell) => cell !== "" && cell !== null))
          .map((row) => {
            let result = {};
            header.forEach((column, index) => {
              const match = excelImportFormat.find(
                (item) => Object.values(item)[0] === column
              );
              if (match) {
                const key = Object.keys(match)[0];
                result[key] = row[index];
              }
            });
            return result;
          })
          .filter((item) => item !== null);

        setLoading(true);
        const { data: response } = await REQUEST.post(
          "/can-ho/upload-excel",
          validData
        );
        setLoading(false);
        setIsDisableLoadMore(true);
        toast.success(response);
        setData((pre) => [...pre, ...validData]);
      };

      reader.readAsArrayBuffer(fileExcel);
      reader.onloadend = () => {
        uploadFileExcelRef.current.value = "";
      };
    } catch (error) {
      setLoading(false);
      console.error("Error while uploading Excel file:", error);
    }
  };

  async function capNhatTrangThai(id, e) {
    const checked = e.target.checked;
    const data = {
      trang_thai: checked ? 0 : 1,
      danh_dau: checked ? "" : "gray",
    };
    const dataPost = { ...data, id };
    setLoading(true);

    try {
      const {
        data: { response, status },
      } = await REQUEST.post("/can-ho/cap-nhat-trang-thai", dataPost);
      toast.success(response);
      setLoading(false);
      if (status) {
        setData((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...data } : item))
        );
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  const styles = {
    yellow_notice: {
      backgroundColor: "yellow",
      padding: 2,
      width: 50,
      textAlign: "center",
      marginRight: 3,
    },
    red_notice: {
      backgroundColor: "red",
      padding: 2,
      width: 50,
      textAlign: "center",
      marginRight: 3,
    },
    orange_notice: {
      backgroundColor: "orange",
      padding: 2,
      width: 50,
      textAlign: "center",
      marginRight: 3,
    },
    w_100: { width: 100 },
  };

  function loadMore() {
    if (isTimKiem) {
      setTimeKiemPages((pre) => pre + 1);
      return;
    }
    setPages((pre) => pre + 1);
  }

  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={500}
        hideProgressBar={false}
      />
      <div className="d-flex justify-content-start m-2">
        <div className="d-flex justify-content-between align-items-center w-100">
          {isAdmin && (
            <div className="d-flex align-items-center">
              <button
                type="button"
                className="btn btn-success"
                onClick={() => setShowModal(true)}
              >
                Thêm mới
              </button>
              <input
                ref={uploadFileExcelRef}
                onChange={uploadFileExcel}
                type="file"
                hidden
              />
              <button
                type="button"
                className="btn btn-outline-primary mx-1"
                onClick={() => uploadFileExcelRef.current.click()}
              >
                Upload file excel
              </button>

              <button
                type="button"
                onClick={() => exportFileExcel(itemChecked)}
                className="btn btn-secondary mx-1"
              >
                Export file excel
              </button>
            </div>
          )}

          <div className="text-start">
            <div className="d-flex flex-row">
              <div style={styles.yellow_notice}>Vàng</div>
              <div> Căn giá rẻ</div>
            </div>
            <div className="d-flex flex-row my-2">
              <div style={styles.red_notice}>Đỏ</div>
              <div> Căn ngoại giao(Không gọi trực tiếp chủ nhà)</div>
            </div>
            <div className="d-flex flex-row">
              <div style={styles.orange_notice}>Cam</div>
              <div> Căn kết hợp</div>
            </div>
          </div>
        </div>
        <Modal className="modal-sm" show={loading} backdrop="static">
          <Modal.Body>
            <div className="d-flex flex-row justify-content-around align-items-center">
              <img
                src={require("../imgs/connect_home.png")}
                height={50}
                width={50}
                alt="Logo"
              />
              <div className="text-center">
                <strong>Connect Home Loading...</strong>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {/*  */}
        <Modal
          className="modal-lg"
          show={showModal}
          scrollable
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Thêm dự án mới</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <label className="mb-3">Thông tin khách hàng</label>
            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  ref={tenDuAnRef}
                  className="form-select"
                  onChange={(e) => {
                    let value = e.target.value;
                    setDataToaNha(
                      dataToaNhaDuAn
                        .filter((item) => item.ten_du_an === value)
                        .map((item) => item.ten_toa_nha)
                    );
                  }}
                  aria-label="Default select example"
                >
                  {dataDuAn.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Tên dự án</label>
              </div>
              <div className="form-floating">
                <select
                  ref={tenToaNhaRef}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataToaNha.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Tên tòa</label>
              </div>
              <div className="form-floating">
                <input
                  ref={maCanHoRef}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Số tầng</label>
              </div>
            </div>
            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  className="form-select"
                  ref={trucCanHoRef}
                  aria-label="Default select example"
                >
                  {dataTrucCanHo.map((item, index) => (
                    <option key={index} value={item.truc_can}>
                      {item.truc_can}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Trục căn hộ</label>
              </div>
              <div className="form-floating">
                <input
                  ref={hoTenChuCanHoRef}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Họ tên chủ căn hộ</label>
              </div>
              <div className="form-floating">
                <input
                  ref={soDienThoaiRef}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Số điện thoại</label>
              </div>
            </div>
            <label className="mb-3">Thông tin căn hộ</label>
            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  className="form-select"
                  ref={danhDauCanHoRef}
                  aria-label="Default select example"
                >
                  {danhDauCanHo.map((item, index) => (
                    <option key={index} value={item.mau_sac}>
                      {item.noi_dung}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Đánh dấu</label>
              </div>

              <div className="form-floating">
                <input
                  ref={soPhongNguRef}
                  type="number"
                  defaultValue={0}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Số phòng ngủ</label>
              </div>
              <div className="form-floating">
                <input
                  ref={soPhongTamRef}
                  type="number"
                  defaultValue={0}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Số phòng tắm</label>
              </div>
            </div>
            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  ref={loaiCanHoRef}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataLoaiCanHo.map((item, index) => (
                    <option key={index} value={item.loai_can_ho}>
                      {item.loai_can_ho}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Loại căn hộ</label>
              </div>

              <div className="form-floating">
                <input
                  ref={dienTichRef}
                  type="number"
                  defaultValue={0}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Diện tích (m²)</label>
              </div>
              <div className="form-floating">
                <select
                  ref={huongBanCongRef}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataHuongCanHo.map((item, index) => (
                    <option key={index} value={item.huong_can_ho}>
                      {item.huong_can_ho}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Hướng ban công</label>
              </div>
            </div>
            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  ref={noiThatRef}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataNoiThat.map((item, index) => (
                    <option key={index} value={item.loai_noi_that}>
                      {item.loai_noi_that}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Nội thất</label>
              </div>
              <div className="form-floating">
                <input
                  ref={giaBanRef}
                  type="number"
                  defaultValue={0}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Giá bán</label>
              </div>
              <div className="form-floating">
                <input
                  ref={giaThueRef}
                  type="number"
                  defaultValue={0}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Giá thuê</label>
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                ref={ghiChuRef}
                type="text"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
              <label htmlFor="floatingInputGrid">Ghi chú</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button onClick={themCanHo} variant="primary">
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal>
        {/*  */}
        <Modal
          show={showModalUpdate}
          backdrop="static"
          keyboard={false}
          className="modal-lg"
          scrollable
        >
          <Modal.Header>
            <Modal.Title>Chi tiết dự án</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModalUpdate(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <label className="mb-3">Thông tin khách hàng</label>
            <div className="input-group mb-3">
              <div className="form-floating">
                <input
                  ref={tenDuAnRef}
                  disabled
                  type="text"
                  defaultValue={dataUpdate.ten_du_an}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Tên dự án</label>
              </div>
              <div className="form-floating">
                <input
                  ref={tenToaNhaRef}
                  disabled
                  type="text"
                  defaultValue={dataUpdate.ten_toa_nha}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Tên tòa</label>
              </div>
              <div className="form-floating">
                <input
                  ref={maCanHoRef}
                  disabled
                  type="text"
                  defaultValue={dataUpdate.ma_can_ho ?? "*"}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Số tầng</label>
              </div>
            </div>
            <div className="input-group mb-3">
              <div className="form-floating">
                <input
                  ref={trucCanHoRef}
                  disabled
                  type="text"
                  defaultValue={dataUpdate.truc_can_ho}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Trục căn hộ</label>
              </div>
              <div className="form-floating">
                <input
                  ref={hoTenChuCanHoRef}
                  defaultValue={dataUpdate.chu_can_ho ?? "*"}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Họ tên chủ căn hộ</label>
              </div>
              <div className="form-floating">
                <input
                  ref={soDienThoaiRef}
                  defaultValue={dataUpdate.so_dien_thoai ?? "*"}
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Số điện thoại</label>
              </div>
            </div>
            <label className="mb-3">Thông tin căn hộ</label>
            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  className="form-select"
                  ref={danhDauCanHoRef}
                  defaultValue={dataUpdate.danh_dau}
                  aria-label="Default select example"
                >
                  {danhDauCanHo.map((item, index) => (
                    <option key={index} value={item.mau_sac}>
                      {item.noi_dung}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Đánh dấu</label>
              </div>

              <div className="form-floating">
                <input
                  ref={soPhongNguRef}
                  type="number"
                  defaultValue={dataUpdate.so_phong_ngu}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Số phòng ngủ</label>
              </div>
              <div className="form-floating">
                <input
                  ref={soPhongTamRef}
                  type="number"
                  defaultValue={dataUpdate.so_phong_tam}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Số phòng tắm</label>
              </div>
            </div>
            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  defaultValue={dataUpdate.loai_can_ho}
                  ref={loaiCanHoRef}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataLoaiCanHo.map((item, index) => (
                    <option key={index} value={item.loai_can_ho}>
                      {item.loai_can_ho}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Loại căn hộ</label>
              </div>

              <div className="form-floating">
                <input
                  ref={dienTichRef}
                  type="number"
                  defaultValue={dataUpdate.dien_tich}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Diện tích (m²)</label>
              </div>
              <div className="form-floating">
                <select
                  ref={huongBanCongRef}
                  defaultValue={dataUpdate.huong_can_ho}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataHuongCanHo.map((item, index) => (
                    <option key={index} value={item.huong_can_ho}>
                      {item.huong_can_ho}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Hướng ban công</label>
              </div>
            </div>
            <div className="input-group mb-3">
              <div className="form-floating">
                <select
                  ref={noiThatRef}
                  defaultValue={dataUpdate.noi_that}
                  className="form-select"
                  aria-label="Default select example"
                >
                  {dataNoiThat.map((item, index) => (
                    <option key={index} value={item.loai_noi_that}>
                      {item.loai_noi_that}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingInputGrid">Nội thất</label>
              </div>
              <div className="form-floating">
                <input
                  ref={giaBanRef}
                  type="number"
                  defaultValue={dataUpdate.gia_ban}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Giá bán</label>
              </div>
              <div className="form-floating">
                <input
                  ref={giaThueRef}
                  type="number"
                  defaultValue={dataUpdate.gia_thue}
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
                <label htmlFor="floatingInputGrid">Giá thuê</label>
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                ref={ghiChuRef}
                type="text"
                defaultValue={dataUpdate.ghi_chu}
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
              <label htmlFor="floatingInputGrid">Ghi chú</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModalUpdate(false)}
            >
              Close
            </Button>
            <Button
              disabled={dataUpdate.trang_thai === 1}
              onClick={capNhatCanHo}
              variant="primary"
            >
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal>
        {/*  */}
        <Modal
          className="modal-lg"
          show={showModalHinhAnh}
          scrollable
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Hình ảnh</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowModalHinhAnh(false)}
            ></Button>
          </Modal.Header>
          <Modal.Body>
            <div className="form-floating mb-3" style={{ zIndex: 1 }}>
              <input
                aria-label="123"
                className="form-control"
                type="file"
                multiple
                id="fileInput"
                ref={hinhAnhRef}
                onChange={capNhatAnhCanHo}
              />
              <label htmlFor="fileInput">Thêm ảnh mới</label>
            </div>
            <div className="form-floating image-container">
              <PreviewImage props={showImageData} onRemoveImage={xoaAnhCanHo} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModalHinhAnh(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={async () => downloadImages(showImageData, dataUpdate)}
            >
              Tải ảnh xuống
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="d-flex flex-wrap gap-4 my-5 mx-2">
        <select
          ref={tenDuAnTimKiemRef}
          className="form-select w-auto"
          aria-label="Default select example"
          onChange={(e) => {
            let value = e.target.value;
            setDataToaNha(
              dataToaNhaDuAn
                .filter((item) => item.ten_du_an === value)
                .map((item) => item.ten_toa_nha)
            );
          }}
        >
          <option value="">Chọn tên dự án</option>
          {dataDuAn.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          ref={tenToaNhaTimKiemRef}
          className="form-select w-auto"
          aria-label="Default select example"
        >
          <option value="">Chọn tên tòa nhà</option>
          {dataToaNha.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          ref={loaiNoiThatTimKiemRef}
          className="form-select w-auto"
          aria-label="Default select example"
        >
          <option value="">Chọn nội thất</option>
          {dataNoiThat.map((item, index) => (
            <option key={index} value={item.loai_noi_that}>
              {item.loai_noi_that}
            </option>
          ))}
        </select>
        <select
          ref={loaiCanHoTimKiemRef}
          className="form-select w-auto"
          aria-label="Default select example"
        >
          <option value=""> Chọn loại căn hộ</option>
          {dataLoaiCanHo.map((item, index) => (
            <option key={index} value={item.loai_can_selectho}>
              {item.loai_can_ho}
            </option>
          ))}
        </select>
        <select
          ref={huongCanHoTimKiemRef}
          className="form-select w-auto"
          aria-label="Default select example"
        >
          <option value="">Chọn hướng ban công</option>
          {dataHuongCanHo.map((item, index) => (
            <option key={index} value={item.huong_can_ho}>
              {item.huong_can_ho}
            </option>
          ))}
        </select>
        <input
          ref={soPhongNguTimKiemRef}
          type="number"
          placeholder="Số phòng ngủ"
          className="form-control w-auto"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        />
        <select
          className="form-select w-auto"
          ref={trucCanHoTimKiemRef}
          aria-label="Default select example"
        >
          <option value="">Chọn trục căn hộ</option>
          {dataTrucCanHo.map((item, index) => (
            <option key={index} value={item.truc_can}>
              {item.truc_can}
            </option>
          ))}
        </select>
        <select
          ref={locGiaCanHoRef}
          className="form-select w-auto"
          aria-label="Default select example"
        >
          <option value="">Lọc giá</option>
          {locGiaCanHo.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={giaBanTuState}
          onChange={(e) => {
            let inputValue = e.target.value.replace(/[^\d]/g, "");
            if (inputValue) {
              setGiaBanTuState(Number(inputValue).toLocaleString());
            } else {
              setGiaBanTuState("");
            }
          }}
          placeholder="Giá từ"
          className="form-control w-auto"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        />
        <input
          value={giaBanDenState}
          onChange={(e) => {
            let inputValue = e.target.value.replace(/[^\d]/g, "");
            if (inputValue) {
              setGiaBanDenState(Number(inputValue).toLocaleString());
            } else {
              setGiaBanDenState("");
            }
          }}
          type="text"
          placeholder="Đến giá"
          className="form-control w-auto"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        />
        <div>
          <button
            className="btn btn-primary"
            onClick={async () => {
              setIsDisableLoadMore(false);
              setTimeKiemPages(1);
              let data = await timKiem(1);
              setData(data);
            }}
          >
            Tìm kiếm
          </button>
          <button className="btn btn-outline-primary mx-2" onClick={lamMoi}>
            Làm mới
          </button>
        </div>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr className="table-primary">
            <th scope="col">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                onChange={(e) => {
                  const checked = e.target.checked;
                  setItemChecked(checked ? data : []);
                }}
                id="flexCheckDefault"
              />
            </th>
            <th scope="col">STT</th>
            <th scope="col">Căn hộ</th>
            <th scope="col">Chủ căn hộ</th>
            <th scope="col">Số điện thoại</th>
            <th scope="col">Giá bán</th>
            <th scope="col">Giá thuê</th>
            <th scope="col">Thông tin căn hộ</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const styles = {
              danh_dau: {
                display: "inline-block",
                backgroundColor: item.danh_dau,
                padding: "1px 5px",
                borderRadius: "5px",
              },
              w_10: { width: "10%" },
              f_: {
                fontSize: 14,
              },
              s_: { transform: "scale(1.3)" },
            };

            let onChecked = itemChecked.includes(item);

            function saveItemChecked() {
              if (onChecked) {
                setItemChecked((pre) => pre.filter((i) => i.id !== item.id));
                return;
              }
              setItemChecked((pre) => [...pre, item]);
            }

            function _infor() {
              setDataUpdate(item);
              setShowModalUpdate(true);
            }

            return (
              <tr key={index} className={onChecked ? "table-primary" : ""}>
                <td className="align-middle">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    onChange={() => {}}
                    onClick={saveItemChecked}
                    checked={onChecked}
                    id="flexCheckDefault"
                  />
                </td>
                <td className="align-middle">{index + 1}</td>
                <td className="align-middle" style={styles.w_10}>
                  <div style={styles.danh_dau}>
                    {item.ten_toa_nha}-{item.ma_can_ho ?? "x"}
                    {item.truc_can_ho}
                  </div>
                </td>
                <td className="align-middle" style={styles.w_10}>
                  {item.chu_can_ho ?? "x"}
                </td>
                <td className="align-middle" style={styles.w_10}>
                  {item.so_dien_thoai ?? "x"}
                </td>
                <td className="align-middle" style={styles.w_10}>
                  {item.gia_ban ? item.gia_ban.toLocaleString("en-US") : 0}
                </td>
                <td className="align-middle" style={styles.w_10}>
                  {item.gia_thue ? item.gia_thue.toLocaleString("en-US") : 0}
                </td>
                <td className="w-25 text-start align-middle">
                  - {item.ten_du_an} - {item.dien_tich}m² - {item.so_phong_ngu}
                  PN
                  {item.so_phong_tam}WC - {item.huong_can_ho}
                  <br />- {item.loai_can_ho}
                  <br />- {item.noi_that}
                  <br />- {item.ghi_chu}
                  <br />-
                  <strong>
                    {item.ngay_cap_nhat &&
                      ` ${item.nguoi_cap_nhat} đã cập nhật ngày ${dateToText(
                        item.ngay_cap_nhat
                      )}`}
                  </strong>
                </td>
                <td className="align-middle">
                  {isAdmin && (
                    <Form.Check
                      style={styles.s_}
                      checked={item.trang_thai === 0}
                      onChange={async (e) => await capNhatTrangThai(item.id, e)}
                      type="switch"
                      id="custom-switch"
                    />
                  )}
                  {isAdmin && (
                    <button
                      type="button"
                      style={styles.f_}
                      onClick={_infor}
                      className="btn btn-primary my-2 w-75"
                    >
                      Chi tiết
                    </button>
                  )}
                  <br />
                  <button
                    onClick={() => showImage(item)}
                    type="button"
                    style={styles.f_}
                    className={`btn w-75 ${
                      item.hinh_anh ? "btn-warning" : "btn-secondary"
                    }`}
                  >
                    Hình ảnh
                  </button>
                  <br />
                  <button
                    style={styles.f_}
                    onClick={() => guiYeuCau(item.id)}
                    type="button"
                    className="btn w-75 btn-info my-2"
                  >
                    Yêu cầu
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mb-3">
        <button
          onClick={loadMore}
          className="btn btn-warning"
          disabled={loading || isDisableLoadMore}
        >
          <FontAwesomeIcon icon={faChevronDown} /> Xem thêm
        </button>
      </div>
    </div>
  );
}
