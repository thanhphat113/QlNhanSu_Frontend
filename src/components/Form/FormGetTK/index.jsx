import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../Button/SubmitButton/Index";
import { handleErrorResponse } from "../../../DefaultActions";
import Api from "../../../Api";
import { useEffect, useState } from "react";

function FormGetTK({ setData }) {
    const [user, setUser] = useState();
    const [caLams, setCaLams] = useState();

    const formik = useFormik({
        initialValues: {
            idCaLam: "",
            idNhanVien: "",
        },
        validationSchema: Yup.object({
            idCaLam: Yup.string().required(
                "Vui lòng lựa chọn ca làm mong muốn"
            ),
            idNhanVien: Yup.string().required("Vui lòng lựa chọn nhân viên"),
        }),
        onSubmit: async (values) => {
            submitUpdate(values);
        },
    });

    const submitUpdate = async (values) => {
        try {
            const response = await Api.get(
                "/api/DiemDanh/diem-danh-chi-tiet",
                {params : {idNhanVien: values.idNhanVien, idCaLam: values.idCaLam}}
            );
			setData(response.data)
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await Api.get("/api/NhanVien/user-for-select");
                setUser(response.data);
            } catch (error) {
                handleErrorResponse(error);
            }
        };
        const getCl = async () => {
            try {
                const response = await Api.get("/api/CaLam");
                setCaLams(response.data);
            } catch (error) {
                handleErrorResponse(error);
            }
        };

		getCl()
		getUser()
    }, []);

    return (
        <form
            onSubmit={formik.handleSubmit}
            className=" bg-white p-5 flex flex-col gap-5 border rounded-4xl"
        >
            <div className="w-full flex flex-col gap-5 mt-5">
                <div className="flex justify-between gap-5">
                    <p className="w-1/3">Ca làm</p>
                    <select
                        name="idCaLam"
                        value={formik.values.idCaLam}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        className=" flex-1 border ps-2"
                    >
                        <option value="">-- Chọn --</option>
						{caLams?.map(item => <option key={item.idCaLam} value={item.idCaLam}>{item.tenCaLam}</option>)}

                    </select>
                </div>
                {formik.errors.idCaLam && formik.touched.idCaLam && (
                    <p className="text-red-500 text-2xl mt-1">
                        * {formik.errors.idCaLam}
                    </p>
                )}
                <div className="flex justify-between gap-5">
                    <p className="w-1/3">Nhân viên</p>
                    <select
                        name="idNhanVien"
                        value={formik.values.idNhanVien}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        className=" flex-1 border ps-2"
                    >
                        <option value="">-- Chọn --</option>
						{user?.map(item => <option key={item.idNhanVien} value={item.idNhanVien}>{item.tenNv}</option>)}
                    </select>
                </div>
                {formik.errors.idNhanVien && formik.touched.idNhanVien && (
                    <p className="text-red-500 text-2xl mt-1">
                        * {formik.errors.idNhanVien}
                    </p>
                )}
            </div>
            <SubmitButton label="Xác nhận"></SubmitButton>
        </form>
    );
}

export default FormGetTK;
