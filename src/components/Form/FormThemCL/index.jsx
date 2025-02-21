import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../Button/SubmitButton/Index";
import { handleErrorResponse, handleMessage } from "../../../DefaultActions";
import Api from "../../../Api";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setMessage } from "../../../Redux/Slices/MessageSlice";

function FormThemCL({ setIsToggle, setCaLams, caLam, type = "create" }) {
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;

	const [prevCaLam, setPrevCaLam] = useState(caLam) 

	const dispatch = useDispatch()

    const formik = useFormik({
		initialValues: caLam || {
            tenCaLam: "",
            thoiGianBatDau: "00:00:00",
            thoiGianTreChoPhep: 0,
            thoiGianKetThuc: "00:00:00",
            thoiGianSomChoPhep: 0,
        },
        validationSchema: Yup.object({
            tenCaLam: Yup.string().required("Tên ca làm không được để trống"),

            thoiGianBatDau: Yup.string()
                .matches(timeRegex, "Thời gian bắt đầu không hợp lệ")
                .required("Thời gian bắt đầu không được để trống"),

            thoiGianKetThuc: Yup.string()
                .matches(timeRegex, "Thời gian kết thúc không hợp lệ")
                .required("Thời gian kết thúc không được để trống")
                .test(
                    "time-compare",
                    "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
                    function (value) {
                        const { thoiGianBatDau } = this.parent;
                        if (
                            value &&
                            thoiGianBatDau &&
                            value <= thoiGianBatDau
                        ) {
                            return false;
                        }
                        return true;
                    }
                ),

            thoiGianTreChoPhep: Yup.number().min(
                0,
                "Thời gian trễ cho phép không được âm"
            ).max(60,"Không được quá 1 giờ"),

            thoiGianSomChoPhep: Yup.number().min(
                0,
                "Thời gian sớm cho phép không được âm"
            ).max(60,"Không được quá 1 giờ")
        }),
		onSubmit: async (values) => {
			if(type === "create") {
				submitCreate(values) 
				return
			} 

			if (JSON.stringify(values) === JSON.stringify(prevCaLam)){
				dispatch(setMessage("Chưa có thông tin nào được cập nhật"))
				return
			}

			submitUpdate(values)
		}
    });

	const submitCreate = async (values) => {
		try {
			const response = await Api.post("/api/CaLam",values)
			handleMessage(response.data.message)
			const result = response.data.calam
			setCaLams((prevCaLams)=> [...prevCaLams,result])
		} catch (error) {
			handleErrorResponse(error)
		}
	}

	const submitUpdate = async (values) => {
		try {
			const response = await Api.put("/api/CaLam",values)
			handleMessage(response.data.message)
			const result = response.data.calam
			setCaLams((prevCaLams)=> prevCaLams.map((item) =>
                item.idCaLam === result.idCaLam ? result : item
            ))

			response.status === 200 && setPrevCaLam(result)
		} catch (error) {
			handleErrorResponse(error)
		}
	}


    return (
        <form
            onSubmit={formik.handleSubmit}
            className="relative w-[60rem] bg-white p-5 flex flex-col gap-5"
        >
            <i
                onClick={() => setIsToggle()}
                className="text-3xl fas fa-times hover:text-red-500 absolute right-5 cursor-pointer"
            ></i>
            <h1 className="text-center text-4xl">CHECK-IN</h1>
            <div className="w-full flex flex-col gap-5 mt-5">
                <div className="flex justify-between gap-5">
                    <p className="w-1/3">Tên ca làm</p>
                    <input
                        type="text"
						name="tenCaLam"
                        value={formik.values.tenCaLam}
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
                        className=" flex-1 border ps-2"
                    ></input>
                </div>
                {formik.errors.tenCaLam && formik.touched.tenCaLam && (
                    <p className="text-red-500 text-2xl mt-1">
                        * {formik.errors.tenCaLam}
                    </p>
                )}
				<div className="flex justify-between gap-5">
                    <p className="w-1/3">Thời gian bắt đầu</p>
                    <input
                        type="time"
						step="1"
						name="thoiGianBatDau"
                        value={formik.values.thoiGianBatDau}
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
                        className=" flex-1 border ps-2"
                    ></input>
                </div>
				{formik.errors.thoiGianBatDau && formik.touched.thoiGianBatDau && (
                    <p className="text-red-500 text-2xl mt-1">
                        * {formik.errors.thoiGianBatDau}
                    </p>
                )}
				<div className="flex justify-between gap-5">
                    <p className="w-1/3">Thời gian trễ cho phép</p>
                    <input
                        type="number"
						name="thoiGianTreChoPhep"
                        value={formik.values.thoiGianTreChoPhep}
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
                        className=" flex-1 border ps-2"
                    ></input>
                </div>
				{formik.errors.thoiGianTreChoPhep && formik.touched.thoiGianTreChoPhep && (
                    <p className="text-red-500 text-2xl mt-1">
                        * {formik.errors.thoiGianTreChoPhep}
                    </p>
                )}
				<div className="flex justify-between gap-5">
                    <p className="w-1/3">Thời gian kết thúc</p>
                    <input
                        type="time"
						step="1"
						name="thoiGianKetThuc"
                        value={formik.values.thoiGianKetThuc}
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
                        className=" flex-1 border ps-2"
                    ></input>
                </div>
				{formik.errors.thoiGianKetThuc && formik.touched.thoiGianKetThuc && (
                    <p className="text-red-500 text-2xl mt-1">
                        * {formik.errors.thoiGianKetThuc}
                    </p>
                )}
				<div className="flex justify-between gap-5">
                    <p className="w-1/3">Thời gian sớm cho phép</p>
                    <input
                        type="number"
						max="60"
						min="0"
						step="1"
						name="thoiGianSomChoPhep"
                        value={formik.values.thoiGianSomChoPhep}
						onBlur={formik.handleBlur}
						onChange={formik.handleChange}
                        className=" flex-1 border ps-2"
                    ></input>
                </div>
				{formik.errors.thoiGianSomChoPhep && formik.touched.thoiGianSomChoPhep && (
                    <p className="text-red-500 text-2xl mt-1">
                        * {formik.errors.thoiGianSomChoPhep}
                    </p>
                )}
            </div>
			<SubmitButton label="Xác nhận"></SubmitButton>
        </form>
    );
}

export default FormThemCL;
