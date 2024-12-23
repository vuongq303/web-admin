import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as xlsx from "xlsx";
import { columnMapping, excelExportFormat } from "../../data/default_data";
import { toast } from "react-toastify";

export const downloadImages = async (images, item) => {
  const folderName = `${item.ten_toa_nha}-${item.ma_can_ho ?? "x"}${
    item.truc_can_ho
  }`;
  const zip = new JSZip();
  const folder = zip.folder(folderName);

  try {
    for (let i = 0; i < images.length; i++) {
      const response = await fetch(images[i]);
      const blob = await response.blob();
      const fileName = `image${i + 1}.jpg`;

      folder.file(fileName, blob);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `${folderName}.zip`);
  } catch (error) {
    console.error("Lỗi khi tải ảnh:", error);
  }
};

export function exportFileExcel(itemChecked) {
  if (itemChecked.length === 0) {
    toast.error("No data");
    return;
  }

  const transformedData = itemChecked.map((row) => {
    const transformedRow = {};
    excelExportFormat.forEach((key) => {
      transformedRow[columnMapping[key] || key] = row[key];
    });
    return transformedRow;
  });

  const worksheet = xlsx.utils.json_to_sheet(transformedData);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = xlsx.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const file = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  saveAs(file, "connect_home.xlsx");
}
