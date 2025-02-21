import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";

import FormCheckIn from "../../Form/FormCheckIn/Index";
import ActionButton from "../../Button/ActionButton/Index";
import DialogLayout from "../../Layout/DialogLayout";
import { AnimatePresence } from "framer-motion";
import FormCheckOut from "../../Form/FormCheckOut";
import Table from "../../Table";

function ChamCong() {
    const [checkIns, setCheckIns] = useState([]);
    const [isToggle, setIsToggle] = useState(false);
    const [lastCheckIn, setLastCheckIn] = useState(false);

    const user = useSelector((state) => state.user.information);

    const thead = [
        "Id",
        "Thời gian bắt đầu",
        "Vào trễ(phút)",
        "Thời gian kết thúc",
        "Về sớm(phút)",
        "Ngày tạo",
        "Loại ca làm",
        "Ghi chú",
        "Đánh giá",
        "Quản lý đã chỉnh sửa",
    ];

    useEffect(() => {
        const getCheckIns = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5045/api/DiemDanh/list-by-user-id",
                    {
                        withCredentials: true,
                        params: { value: user.idNhanVien },
                    }
                );
                console.log(response.data.results);
                setLastCheckIn(response.data.lastCheckIn);
                setCheckIns(response.data.results);
            } catch (error) {
                console.error("Lỗi", error);
            }
        };

        checkIns.length === 0 && getCheckIns();
    }, []);

    const convertToVietnamDate = (utcDateString) => {
        const date = new Date(utcDateString);
        return date.toLocaleDateString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
        });
    };
    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-6xl font-bold">Lịch sử chấm công</h1>
                <div className="w-[15rem]">
                    <ActionButton
                        label={`${
                            lastCheckIn.hasCheckIn ? "Check-Out" : "Check-In"
                        }`}
                        action={() => setIsToggle(true)}
                    />
                </div>
            </div>
            <div className=" mt-3 max-w-[113.5rem] h-[90vh] rounded-[10px] shadow-[0_0_15px_rgba(0,0,0,0.3)] bg-white overflow-x-auto">
                <Table thead={thead}>
                    {checkIns.map((item) => {
                        return (
                            <tr
                                key={item.idDiemDanh}
                                className={`odd:bg-gray-100 even:bg-white h-[4rem] ${
                                    !item.hopLe && "text-red-700"
                                }`}
                            >
                                <td className="px-5 whitespace-nowrap">
                                    {item.idDiemDanh}
                                </td>
                                <td className="px-5 whitespace-nowrap">
                                    {item.thoiGianBatDau.split(".")[0]}
                                </td>
                                <td className="px-5 whitespace-nowrap">
                                    {item.vaoTre}
                                </td>
                                <td className="px-5 whitespace-nowrap">
                                    {item.thoiGianKetThuc?.split(".")[0]}
                                </td>
                                <td className="px-5 whitespace-nowrap">
                                    {item.veSom}
                                </td>
                                <td className="px-5 whitespace-nowrap">
                                    {convertToVietnamDate(item.ngayTao)}
                                </td>
                                <td className="px-5 whitespace-nowrap">
                                    {item.idCaLamNavigation?.tenCaLam}
                                </td>
                                <td className="px-5 whitespace-nowrap">
                                    {item.ghiChu}
                                </td>
                                <td className=" px-5 whitespace-nowrap">
                                    {item.danhGia || "Chưa check-out"}{" "}
                                </td>
                                <td className="px-5 whitespace-nowrap">
                                    {item.tenQL || "Không có chỉnh sửa"}
                                </td>
                            </tr>
                        );
                    })}
                </Table>
            </div>
            <AnimatePresence>
                {isToggle &&
                    (lastCheckIn.hasCheckIn ? (
                        <DialogLayout>
                            <FormCheckOut
                                setIsToggle={setIsToggle}
                                setCheckIns={setCheckIns}
                                lastCheckIn={lastCheckIn}
                                setLastCheckIn={setLastCheckIn}
                            />
                        </DialogLayout>
                    ) : (
                        <DialogLayout>
                            <FormCheckIn
                                setIsToggle={setIsToggle}
                                setCheckIns={setCheckIns}
                                setLastCheckIn={setLastCheckIn}
                            />
                        </DialogLayout>
                    ))}
            </AnimatePresence>
        </div>
    );
}

export default ChamCong;
