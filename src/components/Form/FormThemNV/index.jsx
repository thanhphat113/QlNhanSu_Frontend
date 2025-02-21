import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../Button/SubmitButton/Index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../Redux/Slices/MessageSlice";
import { handleErrorResponse, handleMessage } from "../../../DefaultActions";
import Api from "../../../Api";

function FormThemNV({ setIsToggle, users, setUsers }) {
    const [chucVus, setChucVus] = useState([]);
    const [vaiTros, setVaiTros] = useState([]);
    const { isLoading } = useSelector((state) => state.message);
    const dispatch = useDispatch();

    useEffect(() => {
        const getCV = async () => {
            try {
                const response = await Api.get("/api/ChucVu");
                setChucVus(response.data);
            } catch (error) {
                handleErrorResponse(error);
            }
        };
        getCV();
    }, []);

    useEffect(() => {
        const getVT = async () => {
            try {
                const response = await Api.get("/api/VaiTro");
                setVaiTros(response.data);
            } catch (error) {
               handleErrorResponse(error);
            }
        };
        getVT();
    }, []);

    const formik = useFormik({
        initialValues: {
            tenNv: "",
            sdt: "",
            email: "",
            idChucVu: "",
            idVaiTro: "",
        },
        validationSchema: Yup.object({
            tenNv: Yup.string().required("Tên nhân viên không được để trống"),
            sdt: Yup.string()
                .length(10, "Số điện thoại phải có đúng 10 chữ số")
                .matches(
                    /^(0[3|5|7|8|9])([0-9]{8})$/,
                    "Số điện thoại không hợp lệ!"
                )
                .required("Số điện thoại không được để trống"),
            email: Yup.string()
                .email("Email không hợp lệ")
                .required("Email không được để trống")
                .test(
                    "email-not-registered",
                    "Email này đã được đăng ký",
                    (value) => {
                        return !users.some((item) => item.email === value);
                    }
                ),
        }),
        onSubmit: (values) => {
            createEmployee(values);
        },
    });

    const createEmployee = async (values) => {
        if (isLoading) return;
        dispatch(setLoading(true));
        try {
            const response = await Api.post("/api/NhanVien", values);
            const result = response.data;
            handleMessage(result.message);
            var user = result.user;
            setUsers((prevSetUsers) => [...prevSetUsers, user]);
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="w-[55rem] relative flex flex-col gap-7"
        >
            <div>
                <i
                    onClick={() => setIsToggle()}
                    className="text-3xl fas fa-times hover:text-red-500 absolute right-5 cursor-pointer"
                ></i>
                <h1 className="text-center text-5xl font-bold">
                    Thêm nhân viên
                </h1>
            </div>
            <div className="flex flex-col gap-5 mt-5">
                <div className="w-full flex items-center">
                    <span className="w-[13rem] text-3xl">Tên nhân viên</span>
                    <input
                        className="flex-1 border ps-3 h-[3rem]"
                        name="tenNv"
                        type="text"
                        value={formik.values.tenNv}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                    ></input>
                </div>
                {formik.errors.tenNv && formik.touched.tenNv && (
                    <p className="text-red-500 text-2xl mt-1">
                        * {formik.errors.tenNv}
                    </p>
                )}
                <div className="w-full flex items-center">
                    <span className="w-[13rem] text-3xl">Số điện thoại</span>
                    <input
                        className="flex-1 border ps-3 h-[3rem]"
                        name="sdt"
                        type="text"
                        value={formik.values.sdt}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                    ></input>
                </div>
                {formik.errors.sdt && formik.touched.sdt && (
                    <p className="text-red-500 text-2xl mt-1">
                        * {formik.errors.sdt}
                    </p>
                )}
                <div className="w-full flex items-center">
                    <span className="w-[13rem] text-3xl">Email</span>
                    <input
                        className="flex-1 border ps-3 h-[3rem]"
                        placeholder="...@gmail.com"
                        name="email"
                        type="text"
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                    ></input>
                </div>
                {formik.errors.email && formik.touched.email && (
                    <p className="text-red-500 text-2xl mt-1">
                        * {formik.errors.email}
                    </p>
                )}
                <div className="w-full flex items-center">
                    <span className="w-[13rem] text-3xl">Chức vụ</span>
                    <select
                        className="flex-1 text-center border h-[3rem]"
                        name="idChucVu"
                        value={formik.values.idChucVu}
                        onChange={formik.handleChange}
                    >
                        <option value="">-- Chọn --</option>

                        {chucVus.map((item, index) => (
                            <option key={index} value={item.idChucVu}>
                                {item.tenChucVu}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-full flex items-center">
                    <span className="w-[13rem] text-3xl">Vai trò</span>
                    <select
                        className="flex-1 text-center border h-[3rem]"
                        name="idVaiTro"
                        value={formik.values.idVaiTro}
                        onChange={formik.handleChange}
                    >
                        <option value="">-- Chọn --</option>
                        {vaiTros.map((item, index) => (
                            <option key={index} value={item.idVaiTro}>
                                {item.tenVaiTro} (
                                {item.idQuyens
                                    .map((subItem) => subItem.tenQuyen)
                                    .join(" - ")}
                                )
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <SubmitButton label="Thêm nhân viên"></SubmitButton>
        </form>
    );
}

export default FormThemNV;
