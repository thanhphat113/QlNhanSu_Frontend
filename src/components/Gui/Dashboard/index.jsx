import { useEffect, useState } from "react";
import Box from "../../Box";
import DiemDanh from "../../Chart/DiemDanh";
import Donut from "../../Chart/Donut";
import Api from "../../../Api";
import { handleErrorResponse } from "../../../DefaultActions";
import ChiTietTheoCa from "../../Chart/ChiTietTheoCa";
import FormGetTK from "../../Form/FormGetTK";

function Dashboard() {
    const [count, setCount] = useState();
    const [donutData, setDonutData] = useState([]);
    const [tiLe, setTiLe] = useState();
    const [thongKe, setThongKe] = useState([]);
    const [values, setValues] = useState();

    useEffect(() => {
        const getCount = async () => {
            try {
                const response = await Api.get("/api/NhanVien/count-user");
                setCount(response.data);
                const data = [
                    { name: "Đang hoạt động", value: response.data.hoatDong },
                    { name: "Nghỉ việc", value: response.data.ngungHoatDong },
                ];
                setDonutData(data);
            } catch (error) {
                handleErrorResponse(error);
            }
        };

        const getTile = async () => {
            try {
                const response = await Api.get("/api/DiemDanh/ti-le-check-in");
                setTiLe(response.data.onTimeCheckInRate);
            } catch (error) {
                handleErrorResponse(error);
            }
        };

        const getTK = async () => {
            try {
                const response = await Api.get(
                    "/api/DiemDanh/thong-ke-check-in"
                );
                setThongKe(response.data);
            } catch (error) {
                handleErrorResponse(error);
            }
        };

        getTK();
        getTile();
        getCount();
    }, []);

    return (
        <div className="h-full flex flex-col">
            <div className="py-5 px-5 grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Box
                    content="Tổng nhân sự"
                    number={count?.tong || 0}
                    attribute={"bg-blue-400 text-white"}
                ></Box>
                <Box
                    content="Tỷ lệ Check-In đúng giờ"
                    attribute={"bg-green-400 text-white"}
                    number={`${tiLe}%`}
                ></Box>
            </div>
            <hr></hr>
            <div className="grid grid-cols-3 flex-1 gap-5">
                <div className="bg-white col-span-2 flex flex-col shadow-[0_0_10px_rgba(0,0,0,0.3)] p-5 mt-5 rounded-4xl">
                    <h1 className="text-4xl font-semibold mt-5">
                        Biểu đồ Check-In Check-Out trong tuần
                    </h1>
                    <div className="w-full flex flex-1 items-center justify-center">
                        <DiemDanh data={thongKe} />
                    </div>
                </div>
                <div className="bg-white flex flex-col shadow-[0_0_10px_rgba(0,0,0,0.3)] p-5 mt-5 rounded-4xl">
                    <h1 className="text-4xl font-semibold mt-5">
                        Biểu đồ nhân sự
                    </h1>
                    <div className="w-full flex flex-1 items-center justify-center">
                        <Donut data={donutData} />
                    </div>
                </div>
            </div>
            <div className="w-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] p-5 rounded-4xl mt-5">
                <div className="w-full flex justify-end">
                    <div className="w-1/3 ">
                        <FormGetTK setData={setValues} />
                    </div>
                </div>
                <h1 className="text-4xl font-semibold my-5 w-full text-center">
                    Biểu đồ nhân sự
                </h1>

                <div className="w-full flex flex-1 items-center justify-center">
                    <ChiTietTheoCa data={values} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
