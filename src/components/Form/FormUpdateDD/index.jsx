import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../Button/SubmitButton/Index";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {  setMessage } from "../../../Redux/Slices/MessageSlice";
import { handleErrorResponse, handleMessage } from "../../../DefaultActions";
import Api from "../../../Api";
import Table from "../../Table";

function FormUpdateDD({ userId, setSelectedCheck }) {
    const thead = [
        "Id",
        "Thời gian bắt đầu",
        "Thời gian kết thúc",
        "Đánh giá",
        "Quản lý đã chỉnh sửa",
    ];
    const [diemDanhs, setDiemDanhs] = useState([]);
    const [selected, setSelected] = useState();
	const dispatch = useDispatch()

    useEffect(() => {
        const getCheckIns = async () => {
            try {
                const response = await Api.get("api/DiemDanh/list-by-user-id", {
                    params: { value: userId },
                });
                setDiemDanhs(response.data.results);
            } catch (error) {
                handleErrorResponse(error);
            }
        };
        getCheckIns();
    }, []);

    useEffect(() => {
        if (selected) {
            const item = diemDanhs.filter(
                (item) => item.idDiemDanh === selected
            )[0];
            formik.setFieldValue("idDiemDanh", item.idDiemDanh);
            formik.setFieldValue("thoiGianBatDau", item.thoiGianBatDau.split(".")[0]);
            formik.setFieldValue("thoiGianKetThuc", item.thoiGianKetThuc.split(".")[0]);
            formik.setFieldValue("ghiChu", item.ghiChu || "");

        }
    }, [selected]);

    const formik = useFormik({
        initialValues: {
            idDiemDanh: "",
            thoiGianBatDau: "00:00:00",
            thoiGianKetThuc: "00:00:00",
            ghiChu: "",
        },
        validationSchema: Yup.object({}),
        onSubmit: (values) => {
			if (JSON.stringify(values) === JSON.stringify(formik.initialValues)){
				dispatch(setMessage("Chưa có thông tin nào được thay đổi"))
			}

            submitUpdate(values)
        },
    });

	const submitUpdate = async (values) => {
		try {
			const response = await Api.put("/api/DiemDanh/ChinhSuaDiemDanh",values)
			const result = response.data
			handleMessage(result.message)
			setDiemDanhs((prevdd) =>
				prevdd.map((item) =>
					item.idDiemDanh === result.diemdanh.idDiemDanh ? result.diemdanh : item
				)
			);
		} catch (error) {
			handleErrorResponse(error)
		}
	}

    return (
        <div className="grid  relative grid-cols-3 gap-5 p-10">
            <div className="h-[50rem] col-span-2 border">
                <Table thead={thead}>
                    {diemDanhs &&
                        diemDanhs.map((item) => (
                            <tr
                                className="odd:bg-gray-100 even:bg-white h-[4rem] cursor-pointer hover:shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                                key={item.idDiemDanh}
                                onClick={() => setSelected(item.idDiemDanh)}
                            >
                                <td>{item.idDiemDanh}</td>
                                <td>{item.thoiGianBatDau.split(".")[0]}</td>
                                <td>{item.thoiGianKetThuc.split(".")[0]}</td>
                                <td
                                    className={`${
                                        item.danhGia === "Đúng giờ" ||
                                        item.danhGia === "Check-in đúng giờ" ||
                                        item.danhGia ===
                                            "Check-in đúng giờ - Check-out đúng giờ"
                                            ? "text-green-700"
                                            : "text-red-700"
                                    } px-5 whitespace-nowrap`}
                                >
                                    {item.danhGia}
                                </td>
                                <td>{item.tenQL || "Chưa có chỉnh sửa"}</td>
                            </tr>
                        ))}
                </Table>
            </div>
            <i
                onClick={() => setSelectedCheck()}
                className="text-5xl fas fa-times hover:text-red-500 absolute right-5 cursor-pointer"
            ></i>
            <form
                onSubmit={formik.handleSubmit}
                className=" flex flex-col gap-7 w-[40rem]"
            >
                <div>
                    <h1 className="text-center text-5xl font-bold">
                        Chỉnh sửa điểm danh
                    </h1>
                </div>
                <div className="flex flex-col gap-8">
                    <div className="flex justify-between">
                        <p className="">Thời gian bắt đầu</p>
                        <input
                            className="w-2/3 border"
                            type="time"
                            name="thoiGianBatDau"
                            onChange={formik.handleChange}
                            value={formik.values.thoiGianBatDau}
                            step="1"
                        ></input>
                    </div>
                    <div className="flex justify-between">
                        <p className="flex-1">Thời gian kết thúc</p>
                        <input
                            className="w-2/3 border"
                            type="time"
                            name="thoiGianKetThuc"
                            onChange={formik.handleChange}
                            value={formik.values.thoiGianKetThuc}
                            step="1"
                        ></input>
                    </div>
                    <div className="flex justify-between">
                        <p className="flex-1">Ghi chú</p>
                        <textarea
                            value={formik.values.ghiChu}
                            onChange={formik.handleChange}
                            name="ghiChu"
                            className="w-2/3 h-[10rem] border"
                        ></textarea>
                    </div>
                </div>
                <div className="flex flex-col gap-5 mt-5"></div>
                <SubmitButton label="Chỉnh sửa"></SubmitButton>
            </form>
        </div>
    );
}

export default FormUpdateDD;
