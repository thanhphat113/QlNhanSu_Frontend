import { setLoading, setMessage } from "../Redux/Slices/MessageSlice";
import { resetUser } from "../Redux/Slices/UserSlice";
import CryptoJS from "crypto-js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts;

import store from "../Redux/store";

export const handleErrorResponse = (error) => {
    if (error.status === 401) {
        store.dispatch(
            setMessage(
                "Đã hết thời gian duy trì đăng nhập, vui lòng đăng nhập lại !!!"
            )
        );
        store.dispatch(resetUser());
        store.dispatch(setLoading(false));
    } else store.dispatch(setMessage(`Lỗi: ${error.response.data?.message}`));
};

export const handleFileInputClick = (e, inputRef) => {
    const files = e.target.files;
    const allowedMimeTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
    ];
    const isInvalid = Array.from(files).some((file) => {
        if (!file || !allowedMimeTypes.includes(file.type)) {
            handleMessage("Có dữ liệu không phải file Excel hợp lệ");
            return true;
        } else {
            return false;
        }
    });

    if (isInvalid) {
        inputRef.current.value = "";
        return;
    }

    Array.from(files).map((file) => handleExportExcelFileToPdf(file));
    inputRef.current.value = "";
};

const handleExportExcelFileToPdf = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const merges = sheet["!merges"] || [];

        const tableBody = parsedData.map((row) =>
            row.map((cell) => {
                if (!cell || cell === "" || cell === null || cell === undefined) return {}
                return {
                    text: cell?.toString(),
                    colSpan: cell.colSpan || 1,
                    rowSpan: cell.rowSpan || 1,
                    alignment: "center",
                    fillColor: "#FFFFFF",
                    border: [true, true, true, true],
                };
            })
        );

        for (const merge of merges) {
            const { s, e } = merge;
            tableBody[s.r][s.c].rowSpan = e.r - s.r + 1;
        }

        const rows = tableBody.map((item) => 
            Array.from({ length: item.length }, (_, index) => item[index] ?? {})
        );

        exportToPDFFile("BÁO CÁO THỐNG KÊ", rows);
    };
    reader.readAsArrayBuffer(file);
};

const exportToPDFFile = (title, data) => {
    const docDefinition = {
        pageSize:"A4",
        pageOrientation: "landscape",
        content: [
            { text: `${ title }`, style: "header" },
            {
                table: {
                    headerRows: 1,
                    widths: Array(data[0].length).fill("*"),
                    body: data,
                },
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: "center",
                margin: [0, 0, 0, 10],
            },
        },
    };

    pdfMake
        .createPdf(docDefinition)
        .download(`Report-Pdf-${new Date().toLocaleString("vi-VN")}.pdf`);

    store.dispatch(setMessage("Xuất file PDF thành công"));
};

export const handleMessage = (message) => {
    store.dispatch(setMessage(message));
};

export const hashSHA256 = (text) => {
    return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
};

export const roleCheck = (roles, text) => {
    return roles?.some((item) => item.tenQuyen === text);
};

export const getDayOfWeek = (data) =>
    data?.map((item) => {
        const options = { weekday: "long" };
        const formatter = new Intl.DateTimeFormat("vi-VN", options);

        const dayOfWeek = item.weekDay
            ? formatter.format(new Date(item.weekDay))
            : "Invalid Date";

        return {
            ...item,
            day: dayOfWeek,
        };
    });

export const exportExcel = (tableId) => {
    const table = document.getElementById(tableId);

    if (!table) {
        store.dispatch(setMessage("Không tìm thấy bảng để xuất Excel!"));
        return;
    }

    const tbody = table.getElementsByTagName("tbody")[0];
    if (!tbody || tbody.rows.length === 0) {
        store.dispatch(setMessage("Bảng không có dữ liệu, không thể xuất!"));
        return;
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.table_to_sheet(table);

    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cellAddress]) continue;

            worksheet[cellAddress].s = {
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            };
        }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Report-Excel-${new Date().toLocaleString("vi-VN")}.xlsx`);
    store.dispatch(setMessage("Xuất file Excel thành công"));
};

export const exportPDF = (idTable) => {
    const table = document.getElementById(idTable);

    if (!table) {
        store.dispatch(setMessage("Không tìm thấy bảng để xuất PDF!"));
        return;
    }

    const tbody = table.getElementsByTagName("tbody")[0];
    if (!tbody || tbody.rows.length === 0) {
        store.dispatch(
            setMessage("Bảng không có dữ liệu, không thể xuất PDF!")
        );
        return;
    }

    const rows = [];
    const rowSpanTracker = {};

    Array.from(table.rows).forEach((row, rowIndex) => {
        const rowData = [];

        Array.from(row.cells).forEach((cell, cellIndex) => {
            rowData.push({
                text: cell.innerText,
                colSpan: cell.colSpan || 1,
                rowSpan: cell.rowSpan || 1,
                alignment: "center",
                fillColor: "#FFFFFF",
                border: [true, true, true, true],
            });

            // Nếu ô này có rowspan, lưu lại vị trí cột bị chiếm
            if (cell.rowSpan > 1) {
                for (let i = 1; i < cell.rowSpan; i++) {
                    if (!rowSpanTracker[rowIndex + i])
                        rowSpanTracker[rowIndex + i] = [];
                    rowSpanTracker[rowIndex + i].push(cellIndex);
                }
            }
        });

        if (rowSpanTracker[rowIndex]?.length) {
            const listTracker = rowSpanTracker[rowIndex];
            listTracker.map((item) => {
                rowData.splice(item, 0, {});
            });
        }

        rows.push(rowData);
    });

    exportToPDFFile("BÁO CÁO THỐNG KÊ", rows);
};
