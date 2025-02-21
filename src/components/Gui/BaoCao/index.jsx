import { useEffect, useState } from "react";
import Table from "../../Table";
import FormTKTN from "../../Form/FormTKTN";
import DropdownButton from "../../Button/DropdownButton";
import { exportExcel, exportPDF, handleFileInputClick } from "../../../DefaultActions";
import { useRef } from "react";

function BaoCao() {
    const thead = [
        "Mã nhân viên",
        "Tên nhân viên",
        "Ngày",
        "Thời gian Check-In",
        "Thời gian Check-Out",
        "Ca làm",
        "Đánh giá",
    ];
    const [thongKes, setThongKes] = useState([]);
    const fileRef = useRef();

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-6xl font-bold">Báo cáo</h1>
                <div>
                    <FormTKTN setThongKes={setThongKes} />
                </div>
                <div className="w-[15rem] h-[3rem]">
                    <DropdownButton
                        label="Export"
                        data={[
                            {
                                label: "Excel",
                                action: () => exportExcel("thongKeTable"),
                            },
                            {
                                label: "Pdf",
                                action: () => exportPDF("thongKeTable"),
                            },
                            {
                                label: "ExcelToPDF",
                                action: () => fileRef.current.click(),
                            },
                        ]}
                    />
                    <input
                        type="file"
                        ref={fileRef}
                        multiple
                        onChange={(e) =>handleFileInputClick(e,fileRef)}
                        className="hidden"
                    />
                </div>
            </div>
            <div className=" mt-3 max-w-[113.5rem] h-[90vh] rounded-[10px] shadow-[0_0_15px_rgba(0,0,0,0.3)] bg-white overflow-x-auto">
                <Table thead={thead} id="thongKeTable">
                    {thongKes &&
                        thongKes.map((item) => {
                            return (
                                <>
                                    {item.times.map((value, index) => (
                                        <tr
                                            key={`${item.idNhanVien}${index}`}
                                            className="h-[4rem] hover:bg-[rgba(0,0,0,0.5)] hover:text-white"
                                        >
                                            {index === 0 ? (
                                                <>
                                                    <td
                                                        rowSpan={
                                                            item.times.length
                                                        }
                                                        className=" border p-2 text-center"
                                                    >
                                                        {item.idNhanVien}
                                                    </td>
                                                    <td
                                                        rowSpan={
                                                            item.times.length ||
                                                            1
                                                        }
                                                        className="border px-5 whitespace-nowrap"
                                                    >
                                                        {item.tenNv}
                                                    </td>
                                                </>
                                            ) : null}

                                            <td className="px-5 border whitespace-nowrap">
                                                {value.ngay}
                                            </td>
                                            <td className="px-5 border whitespace-nowrap">
                                                {
                                                    value.thoiGianCI?.split(
                                                        "."
                                                    )[0]
                                                }
                                            </td>
                                            <td className="px-5 border whitespace-nowrap">
                                                {
                                                    value.thoiGianCO?.split(
                                                        "."
                                                    )[0]
                                                }
                                            </td>
                                            <td className="px-5 border whitespace-nowrap">
                                                {value.caLam}
                                            </td>
                                            <td className="px-5 border whitespace-nowrap">
                                                {value.danhGia}
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            );
                        })}
                </Table>
            </div>
        </div>
    );
}

export default BaoCao;
